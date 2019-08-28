import { logErr } from '../utils/utils';
import { Action, EngineConfig, Getter, Hook, HookPosition, HookType, PatchworkConfigType } from './engine.type';

// TODO:
// - Hotload plugin (reset Service, initService / initAction)
export class PatchworkEngine {
  private config: EngineConfig;

  private dispatchBind: any;
  private getBind: any;
  private isExistBind: any;
  private getParameterBind: any;
  private getServiceBind: any;
  private resetServicesBind: any;

  constructor(config: any) {
    this.config = config;

    this.dispatchBind = this.dispatch.bind(this);
    this.getBind = this.get.bind(this);
    this.isExistBind = this.isExist.bind(this);
    this.getParameterBind = this.getParameter.bind(this);
    this.getServiceBind = this.getService.bind(this);
    this.resetServicesBind = this.resetServices.bind(this);
  }

  public init(): PatchworkEngine {
      this.initServices('services');
      this.initActions();

      return this;
  }

  public dispatch(action: Action): void {
    if (this.config.actions[action.type]) {
      const hookBefore = this.getHook(HookType.ACTIONS, HookPosition.BEFORE, action.type);
      const hookAfter = this.getHook(HookType.ACTIONS, HookPosition.AFTER, action.type);

      hookBefore.forEach(hook => hook.value({
        dispatch: this.dispatchBind,
        get: this.getBind,
        getParameter: this.getParameterBind,
        getService: this.getServiceBind,
        isExist: this.isExistBind,
        resetServices : this.resetServicesBind,
      }, action));

      this.config.actions[action.type](
        {
          dispatch: this.dispatchBind,
          get: this.getBind,
          getParameter: this.getParameterBind,
          getService: this.getServiceBind,
          isExist: this.isExistBind,
          resetServices : this.resetServicesBind,
        },
        action.payload);

      hookAfter.forEach(hook => hook.value({
        dispatch: this.dispatchBind,
        get: this.getBind,
        getParameter: this.getParameterBind,
        getService: this.getServiceBind,
        isExist: this.isExistBind,
        resetServices : this.resetServicesBind,
      }, action));
    } else {
        logErr(`@PatchworkEngine::dispatch: Action [${action.type}] unknown`);
    }
  }

  // TODO:
  // - Add caching strategy
  public get(getter: Getter): any {
    if (this.config.getters[getter.type]) {
      const hookBefore = this.getHook(HookType.GETTERS, HookPosition.BEFORE, getter.type);
      const hookAfter = this.getHook(HookType.GETTERS, HookPosition.AFTER, getter.type);

      hookBefore.forEach(hook => hook.value({
        dispatch: this.dispatchBind,
        get: this.getBind,
        getParameter: this.getParameterBind,
        getService: this.getServiceBind,
        isExist: this.isExistBind,
        resetServices : this.resetServicesBind,
      }, getter));

      const getterResult = this.config.getters[getter.type](
        {
          get: this.getBind,
          getParameter: this.getParameterBind,
          getService: this.getServiceBind,
          isExist: this.isExistBind,
        },
        getter.payload);

      hookAfter.forEach(hook => hook.value({
        dispatch: this.dispatchBind,
        get: this.getBind,
        getParameter: this.getParameterBind,
        getService: this.getServiceBind,
        isExist: this.isExistBind,
        resetServices : this.resetServicesBind,
      }, getter));

      return getterResult;
    } else {
        logErr(`@PatchworkEngine::get: Getter [${getter.type}] unknown`);
    }
  }

  public isExist(type: PatchworkConfigType, id: string): boolean {
    const configType: any = this.config[type];
    return configType !== undefined ? configType[id] !== undefined : false;
  }

  // TODO: 'getParamFromState' can access subProperties, IS IT ALLOWED?
  // public isExist(type: PatchworkConfigType, id: string): boolean {
  //   const configType: any = this.config[type];
  //   return configType !== undefined ? getParamFromState(configType, id) !== undefined : false;
  // }

  public getService(serviceName: string): any {
      return this.config.services[serviceName].value;
  }

  public getParameter(key: string, otherConfig?: { parameters?: any }): any {
    if (otherConfig && otherConfig.parameters) {
      const paramFromOtherConfig = otherConfig.parameters[key];
      return paramFromOtherConfig === undefined ? this.config.parameters[key] : paramFromOtherConfig;
    }
    return this.config.parameters[key];
}

  // TODO: 'getParamFromState' can access subProperties, IS IT ALLOWED?
  // public getParameter(key: string, otherConfig?: { parameters?: any }): any {
  //     if (otherConfig && otherConfig.parameters) {
  //       const paramFromOtherConfig = getParamFromState(otherConfig.parameters, key);
  //       return paramFromOtherConfig === undefined ? getParamFromState(this.config.parameters, key) : paramFromOtherConfig;
  //     }
  //     return getParamFromState(this.config.parameters, key);
  // }

  public resetServices(): void {
      Object.values(this.config.services).forEach(service => {
        if (service.reset) {
          service.reset();
        }
      });
  }

  private getHook(hookType: HookType, hookPosition: HookPosition, name: string): Hook[] {
    return this.config.hooks.filter(hook =>
      hook.type === hookType && hook.position === hookPosition && (hook.name === undefined || hook.name === name));
  }

  private initServices(type: string): void {
      const initObj = this.config[type];
      for (const key in initObj) {
          if (initObj[key]) {
            const currObj = initObj[key];
            if (currObj.type) {
              currObj.value = new currObj.type();
            }
            const objParameters = this.config.parameters[key];
            if (currObj.factory) {
              currObj.value = currObj.factory(currObj.config, objParameters);
            }
            if (currObj.init) {
              currObj.init(currObj.value, currObj.config, objParameters);
            }
          }
      }
  }

  private initActions(): void {
    this.config.inits.forEach(actionInit => this.dispatch(actionInit));
  }
}
