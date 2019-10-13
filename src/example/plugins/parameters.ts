import { BasePluginServiceTypes } from './services';

/////////////////////////////////
// PARAMETERS
/////////////////////////////////
export enum BasePluginParameterTypes {
    PARAM_1 = '[basePlugin] PARAM_1]',
    PARAM_2 = '[basePlugin] PARAM_2]',
    PARAM_3 = '[basePlugin] PARAM_3]',
    PARAM_4 = '[basePlugin] PARAM_4]',
}

export const parameters = {
    [BasePluginServiceTypes.MY_SERVICE_1]: {
      code: 'serviceCodeParam1',
      label: 'serviceLabelParam1',
    },
    [BasePluginServiceTypes.MY_SERVICE_2]: {
      code: 'serviceCodeParam2',
      label: 'serviceLabelParam2',
    },
    [BasePluginParameterTypes.PARAM_1]: true,
    [BasePluginParameterTypes.PARAM_2]: 'param2',
    [BasePluginParameterTypes.PARAM_3]: { code: 'code1', label: 'label1' },
    [BasePluginParameterTypes.PARAM_4]: {
      subParam1: { code: 'subCode1', label: 'subLabel1' },
      subParam2: { code: 'subCode2', label: 'subLabel2' },
    },
  };
