import { ActionReducer, createActionInfo, PatchworkActionFunction } from '../../engine';
import { baseGetterInfo } from './getters';
import { BasePluginParameterTypes } from './parameters';

const { gets: createGetter } = baseGetterInfo;

/////////////////////////////////
// ACTIONS
/////////////////////////////////

export interface ActionTypes1 {
  BASE_ACTION1: { code: string, label: string };
  BASE_ACTION2: void;
}

const actions1: ActionReducer<ActionTypes1> = {
  BASE_ACTION1: ({}: PatchworkActionFunction, payload: { code: string, label: string }): void => {
    console.debug(`action1 called: ${JSON.stringify(payload)}`);
  },
  BASE_ACTION2: ({ get, getParameter }: PatchworkActionFunction): void => {
    console.debug(`action2 called: ${createGetter.BASE_FORMAT_CODE_LABEL(get, getParameter(BasePluginParameterTypes.PARAM_3))}`);
  },
};

export interface ActionTypes2 {
  BASE_ACTION3: { code: string, label: string };
  BASE_ACTION4: void;
}

const actions2: ActionReducer<ActionTypes2> = {
  BASE_ACTION3: ({}: PatchworkActionFunction, payload: { code: string, label: string }): void => {
    console.debug(`action3 called: ${JSON.stringify(payload)}`);
  },
  BASE_ACTION4: ({ get, getParameter }: PatchworkActionFunction): void => {
      const parameter = getParameter(BasePluginParameterTypes.PARAM_4).subParam1;
      console.debug(`action4 called: ${createGetter.BASE_FORMAT_CODE_LABEL(get, parameter)}`);
  },
};

type ActionTypes = ActionTypes1 & ActionTypes2;

export const actions: ActionReducer<ActionTypes> = {
  ...actions1,
  ...actions2,
};

export const baseActionInfo = createActionInfo(actions);
