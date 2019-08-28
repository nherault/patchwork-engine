import { getterCreator, GetterReducer, PatchworkGetterFunction } from '../../engine';
import { BasePluginServiceTypes } from './services';

/////////////////////////////////
// GETTERS
/////////////////////////////////

export interface BaseGetterTypes {
    BASE_FORMAT_CODE_LABEL: { code: string, label: string };
    BASE_GET_CODE: { code: string, label: string };
    BASE_GET_LABEL: { code: string, label: string };
    BASE_GET_SERVICE1_ENTITIES: void;
    BASE_GET_SERVICE2_ENTITIES: void;
}

export const getters: GetterReducer<BaseGetterTypes> = {
    BASE_FORMAT_CODE_LABEL: ({ get }: PatchworkGetterFunction, payload: { code: string, label: string }): string => {
        return `${get(BASE_GETTER_CREATOR.BASE_GET_CODE(payload))}: ${get(BASE_GETTER_CREATOR.BASE_GET_LABEL(payload))}`;
    },
    BASE_GET_CODE: ({}: PatchworkGetterFunction, payload: { code: string, label: string }): string => {
        return payload.code;
    },
    BASE_GET_LABEL: ({}: PatchworkGetterFunction, payload: { code: string, label: string }): string => {
        return payload.label;
    },
    BASE_GET_SERVICE1_ENTITIES: ({getService}: PatchworkGetterFunction): any[] => {
        const myService = getService(BasePluginServiceTypes.MY_SERVICE_1);
        return myService.getEntities();
    },
    BASE_GET_SERVICE2_ENTITIES: ({getService}: PatchworkGetterFunction): any[] => {
        const myService = getService(BasePluginServiceTypes.MY_SERVICE_2);
        return myService.getEntities();
    },
};

export const BASE_GETTER_CREATOR = getterCreator(getters);
