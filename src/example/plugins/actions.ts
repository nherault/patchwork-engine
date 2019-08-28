import { actionCreator, ActionReducer, PatchworkActionFunction } from '../../engine';
import { BASE_GETTER_CREATOR } from './getters';
import { BasePluginParameterTypes } from './parameters';

/////////////////////////////////
// ACTIONS
/////////////////////////////////

export interface BaseActionTypes {
  BASE_ACTION1: { code: string, label: string };
  BASE_ACTION2: { code: string, label: string };
  BASE_ACTION3: void;
  BASE_ACTION4: void;
}

export const actions: ActionReducer<BaseActionTypes> = {
    BASE_ACTION1: ({}: PatchworkActionFunction, payload: { code: string, label: string }): void => {
      console.debug(`action1 called: ${JSON.stringify(payload)}`);
    },
    BASE_ACTION2: ({ dispatch, get }: PatchworkActionFunction, payload: { code: string, label: string }): void => {
      console.debug(`action2 called: ${JSON.stringify(payload)}`);
      dispatch(BASE_ACTION_CREATOR.BASE_ACTION1({ code: 'action2', label: get(BASE_GETTER_CREATOR.BASE_FORMAT_CODE_LABEL(payload)) }));
    },
    BASE_ACTION3: ({ get, getParameter }: PatchworkActionFunction): void => {
      console.debug(`action3 called: ${get(BASE_GETTER_CREATOR.BASE_FORMAT_CODE_LABEL(getParameter(BasePluginParameterTypes.PARAM_3)))}`);
    },
    BASE_ACTION4: ({ get, getParameter }: PatchworkActionFunction): void => {
        const parameter = getParameter(BasePluginParameterTypes.PARAM_4).subParam1;
        console.debug(`action4 called: ${get(BASE_GETTER_CREATOR.BASE_FORMAT_CODE_LABEL(parameter))}`);
    },
  };

export const BASE_ACTION_CREATOR = actionCreator(actions);
