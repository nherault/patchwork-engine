import { createGetterInfo, GetterReducer, PatchworkGetterFunction } from '../../engine';
import { BasePluginServiceTypes, Entity } from './services';

/////////////////////////////////
// GETTERS
/////////////////////////////////

interface BaseGetterTypes1 {
    BASE_FORMAT_CODE_LABEL: { code: string, label: string };
    BASE_GET_CODE: { code: string, label: string };
}

interface BaseGetterTypes2 {
    BASE_GET_LABEL: { code: string, label: string };
    BASE_GET_SERVICE1_ENTITIES: void;
    BASE_GET_SERVICE2_ENTITIES: void;
}

const getters1: GetterReducer<BaseGetterTypes1> = {
    BASE_FORMAT_CODE_LABEL: ({ get }: PatchworkGetterFunction, payload: { code: string, label: string }): string => {
        return `${get(createGetter.BASE_GET_CODE(payload))}: ${get(createGetter.BASE_GET_LABEL(payload))}`;
    },
    BASE_GET_CODE: ({}: PatchworkGetterFunction, payload: { code: string, label: string }): string => {
        return payload.code;
    },
};

const getters2: GetterReducer<BaseGetterTypes2> = {
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

type BaseGetterTypes = BaseGetterTypes1 & BaseGetterTypes2;

export const getters: GetterReducer<BaseGetterTypes> = {
    ...getters1,
    ...getters2,
};

export const baseGetterInfo = createGetterInfo(getters);
const { create: createGetter } = baseGetterInfo;
