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
  .getConfig((configResult: ConfigResult) => {
    logDebug(configResult);
  });

logDebug(initConfig);
const patchworkEngine = new PatchworkEngine(initConfig);
patchworkEngine.init();

const { create: createAction } = baseActionInfo;
const { create: createGetter } = baseGetterInfo;
patchworkEngine.dispatch(createAction.BASE_ACTION1({ code: 'code', label: 'label' }));
patchworkEngine.dispatch(createAction.BASE_ACTION2());
patchworkEngine.dispatch(createAction.BASE_ACTION3({ code: 'code', label: 'label' }));
patchworkEngine.dispatch(createAction.BASE_ACTION4());
const codeLabel = patchworkEngine.get(createGetter.BASE_FORMAT_CODE_LABEL({ code: 'code', label: 'label' }));
console.debug(patchworkEngine.get(createGetter.BASE_GET_SERVICE1_ENTITIES()));
console.debug(patchworkEngine.get(createGetter.BASE_GET_SERVICE2_ENTITIES()));
const param1 = patchworkEngine.getParameter(BasePluginParameterTypes.PARAM_1);
const param2 = patchworkEngine.getParameter(BasePluginParameterTypes.PARAM_2);
const param3 = patchworkEngine.getParameter(BasePluginParameterTypes.PARAM_3);
const param4 = patchworkEngine.getParameter(BasePluginParameterTypes.PARAM_4).subParam1.code;
body[0].innerText = `${codeLabel} | ${param1} | ${param2} | ${JSON.stringify(param3)} | ${param4}`;
