import { ActionInits, ActionReducer, PatchworkActionFunction, PluginConfig } from '../../engine/engine.type';
import { actions } from './actions';
import { getters } from './getters';
import { hooks } from './hooks';
import { parameters } from './parameters';
import { BasePluginServiceTypes, Entity, MyService, services } from './services';

/////////////////////////////////
// INITS
/////////////////////////////////
export interface BaseInitActionTypes {
  BASE_INIT_MY_SERVICE_VALUE: { position: { x: number, y: number }};
  BASE_INIT_MY_SERVICES_VALUE: Array<{ position: { x: number, y: number }}>;
}

const inits: ActionInits<BaseInitActionTypes> = [
  { type: 'BASE_INIT_MY_SERVICE_VALUE', payload: { position: { x: 5, y: 2 } }},
  { type: 'BASE_INIT_MY_SERVICES_VALUE', payload: [
    { position: { x: 5, y: 2 } },
    { position: { x: 15, y: 20 } },
  ]},
];

const actionInits: ActionReducer<BaseInitActionTypes> = {
  BASE_INIT_MY_SERVICE_VALUE: ({ getService }: PatchworkActionFunction, payload: Entity): void => {
    const myService1: MyService = getService(BasePluginServiceTypes.MY_SERVICE_1);
    myService1.addEntity(payload);
  },
  BASE_INIT_MY_SERVICES_VALUE: ({ getService }: PatchworkActionFunction, payload: Entity[]): void => {
    const myService1: MyService = getService(BasePluginServiceTypes.MY_SERVICE_1);
    myService1.addEntities(payload);
  },
};

// Export
export const basePlugin: PluginConfig = {
  actions: {
    ...actions,
    ...actionInits,
  },
  getters,
  hooks,
  inits,
  name: 'basePlugin',
  parameters,
  services,
  version: '1.0.0',
};

export * from './actions';
export * from './getters';
export * from './services';
export * from './parameters';
export * from './hooks';
