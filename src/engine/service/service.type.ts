// const list = ['service', 'parameter'] as const;
// type ServiceDepType = typeof list[number];

export type ServiceDep = string | { service: string } | { parameter: string };

export interface ServiceCreator {
    type?: any;
    factory?: (...args: any) => { value: any };
    deps?: Array<ServiceDep>;
    reset?: () => void;
    init?: (service: any, objParameters: any) => void;
}

export interface ServiceCreators {
    [serviceName: string]: ServiceCreator;
}

export interface Service {
    value: any;
    reset?: () => void;
}

export interface Services {
    [serviceName: string]: Service;
}
