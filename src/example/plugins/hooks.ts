import { Action, Getter, HookPosition, HookType } from '../../engine';

/////////////////////////////////
// HOOKS
/////////////////////////////////
export const hooks = [
    {
      position: HookPosition.BEFORE,
      type: HookType.ACTIONS,
      value: ({}, action: Action) => console.debug(`Action: ${action.type} called before: ${JSON.stringify(action.payload)}`),
    },
    {
      position: HookPosition.AFTER,
      type: HookType.ACTIONS,
      value: ({}, action: Action) => console.debug(`Action: ${action.type} called after: ${JSON.stringify(action.payload)}`),
    },
    {
      position: HookPosition.BEFORE,
      type: HookType.GETTERS,
      value: ({}, getter: Getter) => console.debug(`Getter: ${getter.type} called before: ${JSON.stringify(getter.payload)}`),
    },
    {
      position: HookPosition.AFTER,
      type: HookType.GETTERS,
      value: ({}, getter: Getter) => console.debug(`Getter: ${getter.type} called after: ${JSON.stringify(getter.payload)}`),
    },
    {
      name: 'formatCodeLabel',
      position: HookPosition.AFTER,
      type: HookType.GETTERS,
      value: ({}, getter: Getter) =>
        console.debug(`Special Getter with name filter: ${getter.type} called after: ${JSON.stringify(getter.payload)}`),
    },
  ];
