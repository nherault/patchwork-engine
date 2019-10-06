import { PatchworkConfigType } from './engine.type';

export interface PatchworkGetterFunction {
    get: (getter: Getter) => any;
    isExist: (type: PatchworkConfigType, id: string) => boolean;
    getParameter: (key: string, otherConfig?: { parameters?: any }) => any;
    getService: (serviceName: string) => any;
}

export interface Getter {
    type: string;
    payload?: any;
}

export type Get = (getter: Getter) => any;

export type GetterReducer<A> = {
    [T in keyof A]: A[T] extends [infer R1]
        ? (config: PatchworkGetterFunction) => R1
        : A[T] extends [infer P, infer R2] ? (config: PatchworkGetterFunction, payload: P) => R2 : never;
};

export type EngineGetterCreator<A> = {
    [T in keyof A]: A[T] extends [infer R1]
        ? (get: Get) => R1
        : A[T] extends [infer P, infer R2] ? (get: Get, payload: P) => R2 : never;
};

export type EnginePayloadCreator<A> = {
    [T in keyof A]: A[T] extends [any]
        ? { type: T }
        : A[T] extends [infer P, any] ? {type: T, payload: P} : never;
};

export const createGetters = <A>(reducer: GetterReducer<A>): EngineGetterCreator<A> => {
    const result: any = {};
    for (const type in reducer) {
        if (!reducer.hasOwnProperty(type)) {
            continue;
        }
        result[type] = (get: Get, payload: any) => get({ type, payload });
    }
    return result;
};

export const createGetterActions = <A>(reducer: GetterReducer<A>): EnginePayloadCreator<A> => {
    const result: any = {};
    for (const type in reducer) {
        if (!reducer.hasOwnProperty(type)) {
            continue;
        }
        result[type] = (payload: any) => ({ type, payload });
    }
    return result;
};

export const createGetterTypes = <A>(reducer: GetterReducer<A>): {[T in keyof A]: T} => {
    const result: any = {};
    for (const type in reducer) {
        if (!reducer.hasOwnProperty(type)) {
            continue;
        }
        result[type] = type;
    }
    return result;
};

export const createGetterInfo = <A>(reducer: GetterReducer<A>) => {
    return {
        types: createGetterTypes(reducer),
        gets: createGetters(reducer),
        actions: createGetterActions(reducer),
    };
};
