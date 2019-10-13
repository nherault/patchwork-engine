import { Action, ActionReducer } from './action.type';
import { GetterReducer } from './getter.type';
import { Hook } from './hook.type';
import { ServiceCreators, Services } from './service/service.type';

export enum PatchworkConfigType {
    ACTIONS = 'actions',
    GETTERS = 'getters',
    SERVICES = 'services',
    PARAMETERS = 'parameters',
}

export interface ConfigResult {
    errors: string[];
    warnings: string[];
    config: BuildConfig;
}

export interface BuildConfig {
    name: string;
    version: string;
    actions: ActionReducer<any>;
    getters: GetterReducer<any>;
    services: ServiceCreators;
    parameters: { [key: string]: boolean | string | any[] | object };
    inits: Action[];
    hooks: Hook[];
    plugins?: {[key: string]: string };
    [key: string]: any;
}

export interface EngineConfig {
    name: string;
    version: string;
    actions: ActionReducer<any>;
    getters: GetterReducer<any>;
    services: Services;
    parameters: { [key: string]: boolean | string | any[] | object };
    hooks: Hook[];
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
    services?: ServiceCreators;
    parameters?: { [key: string]: boolean | string | any[] | object };
    inits?: Action[];
    hooks?: Hook[];
    required?: PluginRequired;
    [key: string]: any;
}

export type ActionInits = Action[];
