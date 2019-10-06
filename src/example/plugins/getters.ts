import { createGetterInfo, GetterReducer, PatchworkGetterFunction } from '../../engine';
import { BasePluginServiceTypes, Entity } from './services';

/////////////////////////////////
// GETTERS
/////////////////////////////////

export interface GetterTypes1 {
    BASE_FORMAT_CODE_LABEL: [{ code: string, label: string }, string];
    BASE_GET_CODE: [{ code: string, label: string }, string];
}

const getters1: GetterReducer<GetterTypes1> = {
    BASE_FORMAT_CODE_LABEL: ({ get }: PatchworkGetterFunction, payload: { code: string, label: string }): string => {
        return `${createGetter.BASE_GET_CODE(get, payload)}: ${createGetter.BASE_GET_LABEL(get, payload)}`;
    },
    BASE_GET_CODE: ({}: PatchworkGetterFunction, payload: { code: string, label: string }): string => {
        return payload.code;
    },
};

export interface GetterTypes2 {
    BASE_GET_LABEL: [{ code: string, label: string }, string];
    BASE_GET_SERVICE1_ENTITIES: [Entity[]];
    BASE_GET_SERVICE2_ENTITIES: [Entity[]];
}

const getters2: GetterReducer<GetterTypes2> = {
    BASE_GET_LABEL: ({}: PatchworkGetterFunction, payload: { code: string, label: string }): string => {
        return payload.label;
    },
    BASE_GET_SERVICE1_ENTITIES: ({getService}: PatchworkGetterFunction): Entity[] => {
        const myService = getService(BasePluginServiceTypes.MY_SERVICE_1);
        return myService.getEntities();
    },
    BASE_GET_SERVICE2_ENTITIES: ({getService}: PatchworkGetterFunction): Entity[] => {
        const myService = getService(BasePluginServiceTypes.MY_SERVICE_2);
        return myService.getEntities();
    },
};

type GetterTypes = GetterTypes1 & GetterTypes2;

export const getters: GetterReducer<GetterTypes> = {
    ...getters1,
    ...getters2,
};

export const baseGetterInfo = createGetterInfo(getters);
const { gets: createGetter } = baseGetterInfo;
