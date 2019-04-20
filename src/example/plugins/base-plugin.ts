import { HookPosition, HookType, PatchworkActionFunction, PatchworkGetterFunction, PluginConfig } from '../../engine/engine.type';

class MyService {
  private entities: any[];
  constructor() {
    console.debug('constructor: MyService');
    this.entities = [];
  }

  public getEntities(): any[] {
    return this.entities;
  }

  public addEntity(value: any) {
    this.entities.push(value);
  }

  public addEntities(value: any[]) {
    this.entities = this.entities.concat(value);
  }
}

const actions = {
  action1: ({}: PatchworkActionFunction, payload: any) => {
    console.debug(`action1 called: ${JSON.stringify(payload)}`);
  },
  action2: ({ dispatch, get }: PatchworkActionFunction, payload: any) => {
    console.debug(`action2 called: ${JSON.stringify(payload)}`);
    dispatch('action1', { from: 'action2', format: get('formatCodeLabel', payload) });
  },
  action3: ({ get, getParamater }: PatchworkActionFunction) => {
    console.debug(`action3 called: ${get('formatCodeLabel', getParamater('param3'))}`);
  },
  action4: ({ get, getParamater }: PatchworkActionFunction) => {
    console.debug(`action4 called: ${get('formatCodeLabel', getParamater('param4').subParam1)}`);
    console.debug(`action4 called: ${get('formatCodeLabel', getParamater('param4').subParam2)}`);
  },
};

const getters = {
  formatCodeLabel: ({ get }: PatchworkGetterFunction, payload: any) => {
    return `${get('getCode', payload)}: ${get('getLabel', payload)}`;
  },
  getCode: ({}: PatchworkGetterFunction, payload: any) => {
    return payload.code;
  },
  getLabel: ({}: PatchworkGetterFunction, payload: any) => {
    return payload.label;
  },
  getService1Entities: ({getService}: PatchworkGetterFunction) => {
    const myService = getService('myService1');
    return myService.getEntities();
  },
  getService2Entities: ({getService}: PatchworkGetterFunction) => {
    const myService = getService('myService2');
    return myService.getEntities();
  },
};

const parameters = {
  myService1: {
    code: 'serviceCodeParam1',
    label: 'serviceLabelParam1',
  },
  myService2: {
    code: 'serviceCodeParam2',
    label: 'serviceLabelParam2',
  },
  param1: true,
  param2: 'param2',
  param3: { code: 'code1', label: 'label1' },
  param4: {
    subParam1: { code: 'subCode1', label: 'subLabel1' },
    subParam2: { code: 'subCode2', label: 'subLabel2' },
  },
};

const registers = {
  initMyServiceValue: {
    serviceId: 'myService1',
    type: 'pushEntity',
    value: {
      position: { x: 5, y: 2 },
    },
  },
  resetMyServiceValue: {
    serviceId: 'myService2',
    type: 'pushEntities',
    value: [
      { position: { x: 5, y: 2 } },
      { position: { x: 15, y: 20 } },
    ],
  },
};

const initMyService = (serviceName: string, service: any, serviceConfig: any, serviceParam: any) => {
  console.debug(`${serviceName} | ${JSON.stringify(service)} | ${JSON.stringify(serviceConfig)} | ${JSON.stringify(serviceParam)}`);
};

const registerMyService = (service: any, type: string, value: any) => {
  if (type === 'pushEntity') {
    service.addEntity(value);
  } else if (type === 'pushEntities') {
    service.addEntities(value);
  }
};

const services = {
  myService1: {
    config: {
        code: 'serviceCode1',
        label: 'serviceLabel1',
    },
    init: (service: any, serviceConfig: any, serviceParam: any) => {
      initMyService('Myservice1', service, serviceConfig, serviceParam);
    },
    register: registerMyService,
    type: MyService,
  },
  myService2: {
    config: {
        code: 'serviceCode2',
        label: 'serviceLabel2',
    },
    factory: () => {
        return new MyService();
    },
    init: (service: any, serviceConfig: any, serviceParam: any) => {
      initMyService('Myservice2', service, serviceConfig, serviceParam);
    },
    register: registerMyService,
  },
};

const hooks = [
  {
    position: HookPosition.BEFORE,
    type: HookType.ACTIONS,
    value: ({}, actionName: string, payload: any) => console.debug(`Action: ${actionName} called before: ${JSON.stringify(payload)}`),
  },
  {
    position: HookPosition.AFTER,
    type: HookType.ACTIONS,
    value: ({}, actionName: string, payload: any) => console.debug(`Action: ${actionName} called after: ${JSON.stringify(payload)}`),
  },
  {
    position: HookPosition.BEFORE,
    type: HookType.GETTERS,
    value: ({}, getterName: string, payload: any) => console.debug(`Getter: ${getterName} called before: ${JSON.stringify(payload)}`),
  },
  {
    position: HookPosition.AFTER,
    type: HookType.GETTERS,
    value: ({}, getterName: string, payload: any) => console.debug(`Getter: ${getterName} called after: ${JSON.stringify(payload)}`),
  },
];

export const basePlugin: PluginConfig = {
  actions,
  getters,
  hooks,
  name: 'basePlugin',
  parameters,
  registers,
  services,
  version: '1.0.0',
};
