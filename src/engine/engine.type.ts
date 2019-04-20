export interface Actions {
    [id: string]: (patchworkFunction: PatchworkActionFunction, payload: any) => void;
}

export interface Getters {
    [id: string]: (patchworkFunction: PatchworkGetterFunction, payload: any) => void;
}

export interface Services {
    [id: string]: Service;
}

export interface Service {
    config?: any;
    type?: any;
    factory?: (serviceConfig: any, serviceParams: any) => void;
    init?: (service: any, serviceConfig: any, serviceParams: any) => void;
    value?: any;
    reset?: () => void;
    register?: (service: any, type: string, value: any) => void;
}

export enum PatchworkConfigType {
    ACTIONS = 'actions',
    GETTERS = 'getters',
    SERVICES = 'services',
    PARAMETERS = 'parameters',
}

export interface PatchworkActionFunction {
    dispatch: (actionType: string, payload?: any) => void;
    get: (getterType: string, payload?: any) => any;
    isExist: (type: PatchworkConfigType, id: string) => boolean;
    getParamater: (key: string) => any;
    getService: (serviceName: string) => any;
}

export interface PatchworkGetterFunction {
    get: (getterType: string, payload?: any) => any;
    isExist: (type: PatchworkConfigType, id: string) => boolean;
    getParamater: (key: string) => any;
    getService: (serviceName: string) => any;
}

export interface Registers {
    serviceId: string;
    type: string;
    value: any;
}

export const enum HookType {
    ACTIONS = 'actions',
    GETTERS = 'getters',
}

export const enum HookPosition {
    BEFORE = 'before',
    AFTER = 'after',
}

export interface Hook {
    type: HookType;
    position: HookPosition;
    value: (patchworkFunction: PatchworkGetterFunction, hookName: string, hookPayload?: any) => void;
}

export interface EngineConfig {
    name: string;
    version: string;
    actions: Actions;
    getters: Getters;
    services: Services;
    parameters: { [key: string]: boolean | string | any[] | object };
    registers?: { [key: string]: Registers };
    hooks: Hook[];
    [key: string]: any;
}

export const initialConfig = {
    actions: {},
    getters:  {},
    hooks: [],
    name: 'initialConfig',
    parameters:  {},
    services:  {},
    version: '0.0.1',
};

export interface PluginConfig {
    name: string;
    version: string;
    prefix?: string;
    actions?: Actions;
    getters?: Getters;
    services?: Services;
    parameters?: { [key: string]: boolean | string | any[] | object };
    registers?: { [key: string]: Registers };
    hooks?: Hook[];
}
