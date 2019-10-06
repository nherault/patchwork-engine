import { PatchworkConfigType } from './engine.type';
import { Getter } from './getter.type';

export interface PatchworkActionFunction {
    dispatch: (action: Action) => void;
    get: (getter: Getter) => any;
    isExist: (type: PatchworkConfigType, id: string) => boolean;
    getParameter: (key: string, otherConfig?: { parameters?: any }) => any;
    getService: (serviceName: string) => any;
    resetServices: () => void;
}

export interface Action {
    type: string;
    payload?: any;
}

export type Dispatcher = (action: { type: string, payload?: any}) => void;

export type ActionReducer<A> = {
    [T in keyof A]: A[T] extends void
        ? (config: PatchworkActionFunction) => void
        : (config: PatchworkActionFunction, payload: A[T]) => void;
};

export type ActionCreator<A> = {
    [T in keyof A]: A[T] extends void
        ? (dispatch: Dispatcher) => void
        : (dispatch: Dispatcher, payload: A[T]) => void;
};

export type ActionPayloadCreator<A> = {
    [T in keyof A]: A[T] extends void
        ? { type: T }
        : {type: T, payload: A[T]};
};

export const createDispatchers = <A>(reducer: ActionReducer<A>): ActionCreator<A> => {
    const result: any = {};
    for (const type in reducer) {
        if (!reducer.hasOwnProperty(type)) {
            continue;
        }
        result[type] = (dispatch: Dispatcher, payload: any) => dispatch({ type, payload });
    }
    return result;
};

export const createActionActions = <A>(reducer: ActionReducer<A>): ActionPayloadCreator<A> => {
    const result: any = {};
    for (const type in reducer) {
        if (!reducer.hasOwnProperty(type)) {
            continue;
        }
        result[type] = (payload: any) => ({ type, payload });
    }
    return result;
};

export const createActionTypes = <A>(reducer: ActionReducer<A>): {[T in keyof A]: T} => {
    const result: any = {};
    for (const type in reducer) {
        if (!reducer.hasOwnProperty(type)) {
            continue;
        }
        result[type] = type;
    }
    return result;
};

export const createActionInfo = <A>(reducer: ActionReducer<A>) => {
    return {
        types: createActionTypes(reducer),
        dispatch: createDispatchers(reducer),
        actions: createActionActions(reducer),
    };
};
