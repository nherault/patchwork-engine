export interface Entity {
    position: { x: number, y: number };
}

export class MyService {
    private entities: Entity[];
    constructor(param: any) {
        console.debug(`constructor: MyService with param: ${JSON.stringify(param)}`);
        this.entities = [];
    }

    public getEntities(): Entity[] {
        return this.entities;
    }

    public addEntity(value: Entity) {
        this.entities.push(value);
    }

    public addEntities(value: Entity[]) {
        this.entities = this.entities.concat(value);
    }
}

export class MyService2 {
    constructor(param: any) {
        console.debug(`constructor: MyService2 with param: ${JSON.stringify(param)}`);
    }
}

/////////////////////////////////
// SERVICES
/////////////////////////////////
const initMyService = (serviceName: string, service: any, serviceConfig: any, serviceParam: any) => {
    console.debug(`${serviceName} | ${JSON.stringify(service)} | ${JSON.stringify(serviceConfig)} | ${JSON.stringify(serviceParam)}`);
};

export enum BasePluginServiceTypes {
    MY_SERVICE_1 = '[basePlugin] MY_SERVICE_1',
    MY_SERVICE_2 = '[basePlugin] MY_SERVICE_2',
    MY_SERVICE_3 = '[basePlugin] MY_SERVICE_3',
    MY_SERVICE_4 = '[basePlugin] MY_SERVICE_4',
}

export const services = {
    [BasePluginServiceTypes.MY_SERVICE_1]: {
        init: (service: MyService, serviceParam: any) => {
            initMyService('Myservice1', service, {
                code: 'serviceCode1',
                label: 'serviceLabel1',
            }, serviceParam);
        },
        type: MyService,
        deps: [{ parameter: '[basePlugin] PARAM_2]' }]
    },
    [BasePluginServiceTypes.MY_SERVICE_2]: {
        factory: (param: string) => {
            return { value: new MyService(param) };
        },
        init: (service: MyService, serviceParam: any) => {
            initMyService('Myservice2', service, {
                code: 'serviceCode2',
                label: 'serviceLabel2',
            }, serviceParam);
        },
        deps: [{ parameter: '[basePlugin] PARAM_4]' }]
    },
    [BasePluginServiceTypes.MY_SERVICE_3]: {
        init: (service: MyService2, serviceParam: any) => {
            initMyService('Myservice2', service, {
                code: 'serviceCode2',
                label: 'serviceLabel2',
            }, serviceParam);
        },
        type: MyService2,
        deps: ['[basePlugin] MY_SERVICE_1']
    },
    [BasePluginServiceTypes.MY_SERVICE_4]: {
        factory: (param: string) => {
            return { value: new MyService(param) };
        },
        init: (service: MyService, serviceParam: any) => {
            initMyService('Myservice4', service, {
                code: 'serviceCode4',
                label: 'serviceLabel4',
            }, serviceParam);
        },
        deps: [{ parameter: '[basePlugin] PARAM_3]' }]
    },
};
