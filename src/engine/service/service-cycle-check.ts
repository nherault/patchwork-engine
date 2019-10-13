import { ServiceCreators, ServiceDep } from './service.type';

export class ChechServiceCycle {

    private errors: string[];
    private serviceVisited: string[];
    private serviceToCreates: ServiceCreators;

    constructor() {
        this.errors = [];
        this.serviceVisited = [];
        this.serviceToCreates = {};
    }

    public checkCycle(serviceToCreates: ServiceCreators): string[] {
        this.errors = [];
        this.serviceVisited = [];
        this.serviceToCreates = serviceToCreates;
        for (const serviceName in this.serviceToCreates) {
            this.serviceVisited.splice(0);
            this.checkCycleWithDependencies(serviceName);
        }
        return this.errors;
    }
    
    private checkCycleWithDependencies(serviceName: string): void {
        const currService = this.serviceToCreates[serviceName];
        this.serviceVisited.push(serviceName);
        if (currService.deps && currService.deps.length > 0) {
            for (let i = 0; i < currService.deps.length; i++) {
                const serviceDepName = this.getServiceDepName(currService.deps[i]);
                if (serviceDepName) {
                    if (this.serviceVisited.includes(serviceDepName)) {
                        this.errors.push(`Cycling detecting with service: ${serviceDepName}`);
                        break;
                    } else {
                        this.checkCycleWithDependencies(serviceDepName);
                    }
                } 
            }
        } else {
            this.serviceVisited.splice(this.serviceVisited.length -1);
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
}