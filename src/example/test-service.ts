import { ServiceInitializer } from '../engine/service/service-initializer';

class Service1 {
    private id: string = 'service1';
    constructor(service2: Service2) {
        console.log(`${this.id} created... with args: ${JSON.stringify(service2.log())}`);
    }
}

class Service2 {
    private id: string = 'service2';
    constructor() {
        console.log(`${this.id} created...`);
    }

    log(): string {
        return 'service2';
    }
}

class ServiceParam {
    private id: string = 'ServiceParam';
    constructor(param: any) {
        console.log(`${this.id} created... with param: ${param}`);
    }
}

function factory(serviceName: string, ...args: any): any {
    console.log(`${serviceName} created... with args: ${JSON.stringify(args)}`);
    return { value: serviceName };
}

function factoryService1(service2: Service2): any {
    return { value: new Service1(service2) };
}

const myServiceToCreate = {
    service1: { factory: factoryService1, deps: ['service2'] },
    service2: { type: Service2, deps: [] },
    service3: { factory: factory.bind(null, 'service3'), deps: [{ service: 'service4' }] },
    service4: { factory: factory.bind(null, 'service4') },
    service5: { type: ServiceParam, deps: [{ parameter: 'service5Test' }] },
    service6: { factory: factory.bind(null, 'service6'), deps: ['service3'] },
}

console.log('Start creating service');
const servicesCreated = new ServiceInitializer().createServices(myServiceToCreate, { service5Test: 'myService5' });
console.log(`End of service Created: ${JSON.stringify(servicesCreated, null, 2)}`);
