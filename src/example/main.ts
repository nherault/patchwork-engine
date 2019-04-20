import { ConfigBuilder, PatchworkEngine } from '../engine';
import { basePlugin } from './plugins/base-plugin';
const body: HTMLCollectionOf<HTMLElementTagNameMap['body']> = document.getElementsByTagName('body');

const initConfig = new ConfigBuilder()
  .setNameAndVersion('initialConfigTest', '1.1.1')
  .addPlugin(basePlugin)
  .addPlugin({
    name: 'overrideParam',
    parameters: { param1: 'newParam1' },
    version: '0.0.1',
  }, { param2: 'newParam2' })
  .getConfig();

const patchworkEngine = new PatchworkEngine(initConfig);
patchworkEngine.init();

patchworkEngine.dispatch('action1', { code: 'code', label: 'label' });
patchworkEngine.dispatch('action2', { code: 'code', label: 'label' });
const codeLabel = patchworkEngine.get('formatCodeLabel', { code: 'code', label: 'label' });
console.debug(patchworkEngine.get('getService1Entities'));
console.debug(patchworkEngine.get('getService2Entities'));
const param1 = patchworkEngine.getParamater('param1');
const param2 = patchworkEngine.getParamater('param2');
const param3 = patchworkEngine.getParamater('param3');
const param4 = patchworkEngine.getParamater('param4.subParam1.code');
body[0].innerText = `${codeLabel} | ${param1} | ${param2} | ${JSON.stringify(param3)} | ${param4}`;
