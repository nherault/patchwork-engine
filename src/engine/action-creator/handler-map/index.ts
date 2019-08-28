import { Arg2, Equals, If, Or } from '../types/helpers';

export type NonObjectOrFunction =
    | string
    | number
    | undefined
    | null
    | any[]
    | symbol;

export type MaybePartial<T> = T extends NonObjectOrFunction ? T : Partial<T>;

export type HandlerType<State, T> = T extends NonObjectOrFunction
    ? State extends T ? State : never
    : T extends (() => MaybePartial<State>)
        ? (() => MaybePartial<State>)
        : T extends ((state: State) => MaybePartial<State>)
            ? (state: State) => MaybePartial<State>
            : T extends ((state: State, payload: any) => MaybePartial<State>)
                ? ((state: State, payload: Arg2<T>) => MaybePartial<State>)
                : T extends MaybePartial<State> ? MaybePartial<State> : never;

export type HandlerMap<State, HM> = {
    [K in keyof HM]: HandlerType<State, HM[K]>
};

export type ActionFromPayload<
    ActionName,
    Payload extends string | void | object
> = If<
    Or<Equals<Payload, ActionName>, Equals<Payload, void>>,
    { type: ActionName },
    { type: ActionName; payload: Payload }
>;
