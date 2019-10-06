import { Action, ActionReducer, PatchworkActionFunction } from './action.type';
import { Getter, GetterReducer } from './getter.type';

export interface Services {
    [serviceName: string]: Service;
}

export interface Service {
    config?: any;
    type?: any;
    factory?: (serviceConfig: any, serviceParams: any) => void;
    init?: (service: any, serviceConfig: any, serviceParams: any) => void;
    value?: any;
    reset?: () => void;
}

export enum PatchworkConfigType {
    ACTIONS = 'actions',
    GETTERS = 'getters',
    SERVICES = 'services',
    PARAMETERS = 'parameters',
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
    name?: string;
    value: (patchworkFunction: PatchworkActionFunction, action: Action | Getter) => void;
}

export interface ConfigResult {
    errors: string[];
    warnings: string[];
    config: EngineConfig;
}

export interface EngineConfig {
    name: string;
    version: string;
    actions: ActionReducer<any>;
    getters: GetterReducer<any>;
    services: Services;
    parameters: { [key: string]: boolean | string | any[] | object };
    inits: Action[];
    hooks: Hook[];
    plugins?: {[key: string]: string };
    [key: string]: any;
}

export const initialConfig = {
    actions: {},
    getters:  {},
    hooks: [],
    inits: [],
    name: 'initialConfig',
    parameters:  {},
    services:  {},
    version: '0.0.1',
};

export interface PluginRequired {
    plugins?: {[key: string]: string };
    services?: string[];
    actions?: string[];
    getters?: string[];
}

export interface PluginConfig {
    name: string;
    version: string;
    actions?: ActionReducer<any>;
    getters?: GetterReducer<any>;
    services?: Services;
    parameters?: { [key: string]: boolean | string | any[] | object };
    inits?: Action[];
    hooks?: Hook[];
    required?: PluginRequired;
    [key: string]: any;
}

export type ActionInits = Action[];
