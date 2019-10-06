import { ActionReducer, PatchworkActionFunction } from '../../engine';
import { ActionInits, PluginConfig } from '../../engine/engine.type';
import { actions } from './actions';
import { getters } from './getters';
import { hooks } from './hooks';
import { parameters } from './parameters';
import { BasePluginServiceTypes, Entity, MyService, services } from './services';

/////////////////////////////////
// INITS
/////////////////////////////////

const inits: ActionInits = [
  { type: 'BASE_INIT_MY_SERVICE_VALUE', payload: { position: { x: 5, y: 2 } }},
  { type: 'BASE_INIT_MY_SERVICES_VALUE', payload: [
    { position: { x: 5, y: 2 } },
    { position: { x: 15, y: 20 } },
  ]},
];

interface ActionInitsType {
  BASE_INIT_MY_SERVICE_VALUE: Entity;
  BASE_INIT_MY_SERVICES_VALUE: Entity[];
}

const actionInits: ActionReducer<ActionInitsType> = {
  BASE_INIT_MY_SERVICE_VALUE: ({ getService }: PatchworkActionFunction, payload: Entity): void => {
    const myService1: MyService = getService(BasePluginServiceTypes.MY_SERVICE_1);
    myService1.addEntity(payload);
  },
  BASE_INIT_MY_SERVICES_VALUE: ({ getService }: PatchworkActionFunction, payload: Entity[]): void => {
    const myService1: MyService = getService(BasePluginServiceTypes.MY_SERVICE_2);
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
