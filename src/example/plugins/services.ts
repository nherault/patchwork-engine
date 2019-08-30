export interface Entity {
    position: { x: number, y: number };
}

export class MyService {
    private entities: Entity[];
    constructor() {
        console.debug('constructor: MyService');
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

/////////////////////////////////
// SERVICES
/////////////////////////////////
const initMyService = (serviceName: string, service: any, serviceConfig: any, serviceParam: any) => {
    console.debug(`${serviceName} | ${JSON.stringify(service)} | ${JSON.stringify(serviceConfig)} | ${JSON.stringify(serviceParam)}`);
};

export enum BasePluginServiceTypes {
    MY_SERVICE_1 = '[basePlugin] MY_SERVICE_1',
    MY_SERVICE_2 = '[basePlugin] MY_SERVICE_2',
}

export const services = {
    [BasePluginServiceTypes.MY_SERVICE_1]: {
        config: {
            code: 'serviceCode1',
            label: 'serviceLabel1',
        },
        init: (service: any, serviceConfig: any, serviceParam: any) => {
            initMyService('Myservice1', service, serviceConfig, serviceParam);
        },
        type: MyService,
    },
    [BasePluginServiceTypes.MY_SERVICE_2]: {
        config: {
            code: 'serviceCode2',
            label: 'serviceLabel2',
        },
        factory: () => {
            return new MyService();
        },
        init: (service: any, serviceConfig: any, serviceParam: any) => {
            initMyService('Myservice2', service, serviceConfig, serviceParam);
        },
    },
};
