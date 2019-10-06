import { ConfigBuilder, ConfigResult, PatchworkEngine } from '../engine';
import { logDebug } from '../utils/utils';
import { baseActionInfo, baseGetterInfo, basePlugin, BasePluginParameterTypes } from './plugins/base-plugin';
const body: HTMLCollectionOf<HTMLElementTagNameMap['body']> = document.getElementsByTagName('body');

const initConfig = new ConfigBuilder()
  .setNameAndVersion('initialConfigTest', '1.1.1')
  .addPlugin(basePlugin)
  .addPlugin({
    name: 'overrideParam',
    parameters: { param1: 'newParam1' },
    required: {
      actions: ['badAction'],
      getters: ['badGetter'],
      plugins: { badPlugin: '1.0.0' },
      services: ['badService'],
    },
    version: '0.0.1',
  }, { param2: 'newParam2', param1: 'newParam1Bis' })
  .log()
  .build((configResult: ConfigResult) => {
    logDebug(configResult);
  });

logDebug(initConfig);
const patchworkEngine = new PatchworkEngine(initConfig);
patchworkEngine.init();

const { dispatch: dispatch } = baseActionInfo;
const { gets: get } = baseGetterInfo;
dispatch.BASE_ACTION1(patchworkEngine.dispatchBind, { code: 'code', label: 'label' });
dispatch.BASE_ACTION2(patchworkEngine.dispatchBind);
dispatch.BASE_ACTION3(patchworkEngine.dispatchBind, { code: 'code', label: 'label' });
dispatch.BASE_ACTION4(patchworkEngine.dispatchBind);
const codeLabel = get.BASE_FORMAT_CODE_LABEL(patchworkEngine.getBind, { code: 'code', label: 'label' });
console.debug(get.BASE_GET_SERVICE1_ENTITIES(patchworkEngine.getBind));
console.debug(get.BASE_GET_SERVICE2_ENTITIES(patchworkEngine.getBind));
const param1 = patchworkEngine.getParameter(BasePluginParameterTypes.PARAM_1);
const param2 = patchworkEngine.getParameter(BasePluginParameterTypes.PARAM_2);
const param3 = patchworkEngine.getParameter(BasePluginParameterTypes.PARAM_3);
const param4 = patchworkEngine.getParameter(BasePluginParameterTypes.PARAM_4).subParam1.code;
body[0].innerText = `${codeLabel} | ${param1} | ${param2} | ${JSON.stringify(param3)} | ${param4}`;
