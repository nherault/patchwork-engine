import { logErr } from '../utils/utils';
import { Action } from './action.type';
import { BuildConfig, EngineConfig, PatchworkConfigType } from './engine.type';
import { Getter } from './getter.type';
import { Hook, HookPosition, HookType } from './hook.type';
import { Services } from './service/service.type';
import { ServiceInitializer } from './service/service-initializer';

// TODO:
// - Hotload plugin (reset Service, initService / initAction)
export class PatchworkEngine {
  public readonly dispatchBind: any;
  public readonly getBind: any;

  private config: EngineConfig;

  private readonly isExistBind: any;
  private readonly getParameterBind: any;
  private readonly getServiceBind: any;
  private readonly resetServicesBind: any;

  private readonly serviceInitializer: ServiceInitializer;

  constructor(config: BuildConfig) {
    this.dispatchBind = this.dispatch.bind(this);
    this.getBind = this.get.bind(this);
    this.isExistBind = this.isExist.bind(this);
    this.getParameterBind = this.getParameter.bind(this);
    this.getServiceBind = this.getService.bind(this);
    this.resetServicesBind = this.resetServices.bind(this);
    this.serviceInitializer = new ServiceInitializer();

    this.config = this.init(config);
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

  private init(config: BuildConfig): EngineConfig {
    const engineConfig = {
      actions: config.actions,
      getters: config.getters,
      hooks: config.hooks,
      parameters: config.parameters,
      name: config.name,
      version: config.version,
      services: {},
    };
    this.config = engineConfig;
    engineConfig.services = this.initServices(config);
    this.initActions(config);
    return engineConfig;
  }

  private initServices(config: BuildConfig): Services {
      const initObj = config.services;
      const { errors, result: services } = this.serviceInitializer.createServices(config.services, config.parameters);
      if (errors.length > 0) {
        errors.forEach(error => logErr(`@PatchworkEngine::initServices: ${error}`));
      } else {
        for (const key in initObj) {
          if (initObj[key]) {
            const currObj = initObj[key];
            const objParameters = config.parameters[key];
            if (services[key]) {
              services[key].reset = currObj.reset;
              if (currObj.init) {
                currObj.init(services[key], objParameters);
              }
            }
          }
        }
      }
      return services;
  }

  private initActions(config: BuildConfig): void {
    config.inits.forEach(actionInit => this.dispatch(actionInit));
  }
}
