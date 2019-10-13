import { Action, PatchworkActionFunction } from './action.type';
import { Getter } from './getter.type';

export const enum HookType {
    ACTIONS = 'actions',
    GETTERS = 'getters',
}

export const enum HookPosition {
    BEFORE = 'before',
    AFTER = 'after',
}

export interface Hook {
    type: HookType;
    position: HookPosition;
    name?: string;
    value: (patchworkFunction: PatchworkActionFunction, action: Action | Getter) => void;
}
