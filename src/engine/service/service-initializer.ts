import { ServiceCreators, Services, ServiceDep, ServiceCreator, Service } from './service.type';
import { ChechServiceCycle } from './service-cycle-check';
import { getParamFromState } from './utils';

export class ServiceInitializer {

    private errors: string[];
    private servicesCreated: Services;
    private serviceToCreates: ServiceCreators;
    private parameters: any;
    private checkCycleService: ChechServiceCycle;

    constructor() {
        this.errors = [];
        this.servicesCreated = {};
        this.serviceToCreates = {};
        this.checkCycleService = new ChechServiceCycle();
    }

    public createServices(serviceToCreates: ServiceCreators, parameters?: any): { errors: string[], result: Services } {
        this.servicesCreated = {};
        this.serviceToCreates = serviceToCreates;
        this.parameters = parameters === undefined ? {} : parameters;
        this.errors = this.checkCycleService.checkCycle(serviceToCreates);
        if (this.errors.length === 0) {
            for (const serviceName in serviceToCreates) {
                this.createService(serviceName);
            }
        }
        return { errors: this.errors, result: this.errors.length === 0 ? this.servicesCreated : {} };
    }

    private createService(serviceName: string): void {
        const currServiceToCreate = this.serviceToCreates[serviceName];
        if (currServiceToCreate.deps && currServiceToCreate.deps.length > 0) {
            currServiceToCreate.deps.forEach(serviceDepsName => {
                const serviceDepName = this.getServiceDepName(serviceDepsName);
                if (serviceDepName && this.servicesCreated[serviceDepName] === undefined) {
                    this.createService(serviceDepName);
                }
            });
        }
    
        if (this.servicesCreated[serviceName] === undefined) {
            const serviceGenerate = this.generateService(serviceName, currServiceToCreate);
            if (serviceGenerate !== undefined) {
                this.servicesCreated[serviceName] = serviceGenerate;
            } else {
                this.errors.push(`Service generation failed: ${serviceName} (no 'type' or 'factory')`);
            }
        }
    }
    
    private getServiceDepName(serviceDepsName: ServiceDep): string | undefined {
        if (typeof serviceDepsName === 'string') {
            return serviceDepsName;
        } else if ((serviceDepsName as any).service !== undefined) {
            return (serviceDepsName as any).service;
        }
        return undefined;
    }
    
    private getServiceDepValue(dep: ServiceDep): any {
        if (typeof dep === 'string') {
            return this.servicesCreated[dep].value;
        } else if ((dep as any).service !== undefined) {
            return this.servicesCreated[(dep as any).service].value;
        } else if ((dep as any).parameter !== undefined) {
            return getParamFromState(this.parameters, (dep as any).parameter);
        }
        return undefined;
    }
    
    private generateService(serviceName:string, serviceToCreate: ServiceCreator): Service | undefined {
        const injectDeps = serviceToCreate.deps ? serviceToCreate.deps.map(deps => {
            const depValue = this.getServiceDepValue(deps);
            if (depValue === undefined) {
                this.errors.push(`Dependencies not defined for service '${serviceName}': ${JSON.stringify(deps)}`);
            }
            return depValue;
        }) : [];
        if (serviceToCreate.type) {
            return { value: new serviceToCreate.type(...injectDeps) };
        } else if (serviceToCreate.factory) { 
            return serviceToCreate.factory(...injectDeps);
        }
        return undefined;
    }
}