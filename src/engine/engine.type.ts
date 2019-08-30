export interface Action {
    type: string;
    payload?: any;
}

export interface Getter {
    type: string;
    payload?: any;
}

export interface Actions {
    [id: string]: (patchworkFunction: PatchworkActionFunction, payload: any | never) => void;
}

export interface Getters {
    [id: string]: (patchworkFunction: PatchworkGetterFunction, payload?: any | never) => void;
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
}

export enum PatchworkConfigType {
    ACTIONS = 'actions',
    GETTERS = 'getters',
    SERVICES = 'services',
    PARAMETERS = 'parameters',
}

export interface PatchworkActionFunction {
    dispatch: (action: Action) => void;
    get: (getter: Getter) => any;
    isExist: (type: PatchworkConfigType, id: string) => boolean;
    getParameter: (key: string, otherConfig?: { parameters?: any }) => any;
    getService: (serviceName: string) => any;
    resetServices: () => void;
}

export interface PatchworkGetterFunction {
    get: (getter: Getter) => any;
    isExist: (type: PatchworkConfigType, id: string) => boolean;
    getParameter: (key: string, otherConfig?: { parameters?: any }) => any;
    getService: (serviceName: string) => any;
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
}

export interface EngineConfig {
    name: string;
    version: string;
    actions: Actions;
    getters: Getters;
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
    actions?: Actions;
    getters?: Getters;
    services?: Services;
    parameters?: { [key: string]: boolean | string | any[] | object };
    inits?: Action[];
    hooks?: Hook[];
    required?: PluginRequired;
    [key: string]: any;
}

export type ActionInits<A> = Array<{ type: keyof A, payload: A[keyof A]}>;

export type Reducer<C, A> = {
    [T in keyof A]: A[T] extends void ? (config: C) => void : (config: C, payload: A[T]) => void;
};

export type ActionReducer<A> = Reducer<PatchworkActionFunction, A>;
export type GetterReducer<A> = Reducer<PatchworkGetterFunction, A>;

type EngineActionCreator<A> = {
    [T in keyof A]: A[T] extends void ? () => { type: T } : (payload: A[T]) => { type: T, payload: A[T]};
};

const create = <A, C>(reducer: Reducer<C, A>): EngineActionCreator<A> => {
    const result: any = {};
    for (const type in reducer) {
        if (!reducer.hasOwnProperty(type)) {
            continue;
        }
        result[type] = (payload: any) => ({ type, payload });
    }
    return result;
};

const createTypes = <C, A>(reducer: Reducer<C, A>): {[T in keyof A]: T} => {
    const result: any = {};
    for (const type in reducer) {
        if (!reducer.hasOwnProperty(type)) {
            continue;
        }
        result[type] = type;
    }
    return result;
};

const createInfo = <A, C>(reducer: Reducer<C, A>) => {
    return {
        types: createTypes(reducer),
        create: create(reducer),
    };
};

export const createActionType = createTypes;
export const createGetterType = createTypes;

export const createAction = create;
export const createGetter = create;

export const createActionInfo = createInfo;
export const createGetterInfo = createInfo;
