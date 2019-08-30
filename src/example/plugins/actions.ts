import { ActionReducer, createActionInfo, PatchworkActionFunction } from '../../engine';
import { baseGetterInfo } from './getters';
import { BasePluginParameterTypes } from './parameters';

const { create: createGetter } = baseGetterInfo;

/////////////////////////////////
// ACTIONS
/////////////////////////////////

interface BaseActionTypes1 {
  BASE_ACTION1: { code: string, label: string };
  BASE_ACTION2: void;
}

interface BaseActionTypes2 {
  BASE_ACTION3: { code: string, label: string };
  BASE_ACTION4: void;
}

const actions1: ActionReducer<BaseActionTypes1> = {
    BASE_ACTION1: ({}: PatchworkActionFunction, payload: { code: string, label: string }): void => {
      console.debug(`action1 called: ${JSON.stringify(payload)}`);
    },
    BASE_ACTION2: ({ get, getParameter }: PatchworkActionFunction): void => {
      console.debug(`action2 called: ${get(createGetter.BASE_FORMAT_CODE_LABEL(getParameter(BasePluginParameterTypes.PARAM_3)))}`);
    },
  };

const actions2: ActionReducer<BaseActionTypes2> = {
    BASE_ACTION3: ({}: PatchworkActionFunction, payload: { code: string, label: string }): void => {
      console.debug(`action3 called: ${JSON.stringify(payload)}`);
    },
    BASE_ACTION4: ({ get, getParameter }: PatchworkActionFunction): void => {
        const parameter = getParameter(BasePluginParameterTypes.PARAM_4).subParam1;
        console.debug(`action4 called: ${get(createGetter.BASE_FORMAT_CODE_LABEL(parameter))}`);
    },
  };

type BaseActionTypes = BaseActionTypes1 & BaseActionTypes2;

export const actions: ActionReducer<BaseActionTypes> = {
  ...actions1,
  ...actions2,
};

export const baseActionInfo = createActionInfo(actions);
