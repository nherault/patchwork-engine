import { getParamFromState, logErr } from '../utils/utils';
import { EngineConfig, HookPosition, HookType, PatchworkConfigType } from './engine.type';

// TODO:
// - Hotload plugin (reset Service, initService / initRegisters)
export class PatchworkEngine {
  private config: EngineConfig;

  private dispatchBind: any;
  private getBind: any;
  private isExistBind: any;
  private getParamaterBind: any;
  private getServiceBind: any;

  constructor(config: any) {
    this.config = config;

    this.dispatchBind = this.dispatch.bind(this);
    this.getBind = this.get.bind(this);
    this.isExistBind = this.isExist.bind(this);
    this.getParamaterBind = this.getParamater.bind(this);
    this.getServiceBind = this.getService.bind(this);
  }

  public init(): PatchworkEngine {
      this.initServices('services');
      this.initRegisters();

      return this;
  }

  public dispatch(actionType: string, payload?: any): void {
    if (this.config.actions[actionType]) {
      const hookBefore = this.config.hooks.filter(hook => hook.type === HookType.ACTIONS && hook.position === HookPosition.BEFORE);
      const hookAfter = this.config.hooks.filter(hook => hook.type === HookType.ACTIONS && hook.position === HookPosition.AFTER);

      hookBefore.forEach(hook => hook.value({
        get: this.getBind,
        getParamater: this.getParamaterBind,
        getService: this.getServiceBind,
        isExist: this.isExistBind,
      },
      actionType,
      payload));

      this.config.actions[actionType](
        {
          dispatch: this.dispatchBind,
          get: this.getBind,
          getParamater: this.getParamaterBind,
          getService: this.getServiceBind,
          isExist: this.isExistBind,
        },
        payload);

      hookAfter.forEach(hook => hook.value({
        get: this.getBind,
        getParamater: this.getParamaterBind,
        getService: this.getServiceBind,
        isExist: this.isExistBind,
      },
      actionType,
      payload));
    } else {
        logErr(`@PatchworkEngine::dispatch: Action [${actionType}] unknown`);
    }
  }

  // TODO:
  // - Add caching strategy
  public get(getterType: string, payload?: any): any {
    if (this.config.getters[getterType]) {
      const hookBefore = this.config.hooks.filter(hook => hook.type === HookType.ACTIONS && hook.position === HookPosition.BEFORE);
      const hookAfter = this.config.hooks.filter(hook => hook.type === HookType.ACTIONS && hook.position === HookPosition.AFTER);

      hookBefore.forEach(hook => hook.value({
        get: this.getBind,
        getParamater: this.getParamaterBind,
        getService: this.getServiceBind,
        isExist: this.isExistBind,
      },
      getterType,
      payload));

      const getterResult = this.config.getters[getterType](
        {
          get: this.getBind,
          getParamater: this.getParamaterBind,
          getService: this.getServiceBind,
          isExist: this.isExistBind,
        },
        payload);

      hookAfter.forEach(hook => hook.value({
        get: this.getBind,
        getParamater: this.getParamaterBind,
        getService: this.getServiceBind,
        isExist: this.isExistBind,
      },
      getterType,
      payload));

      return getterResult;
    } else {
        logErr(`@PatchworkEngine::get: Getter [${getterType}] unknown`);
    }
  }

  public isExist(type: PatchworkConfigType, id: string): boolean {
    const configType: any = this.config[type];
    return configType !== undefined ? getParamFromState(configType, id) !== undefined : false;
  }

  public getService(serviceName: string): any {
      return this.config.services[serviceName].value;
  }

  public getParamater(key: string): any {
      return getParamFromState(this.config.parameters, key);
  }

  public resetServices(): void {
      Object.values(this.config.services).forEach(service => {
        if (service.reset) {
          service.reset();
        }
      });
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

  private initRegisters(): void {
    const registers = this.config.registers;
    for (const key in registers) {
      if (registers[key]) {
        const register = registers[key];
        if (this.isExist(PatchworkConfigType.SERVICES, register.serviceId)) {
          const service = this.config.services[register.serviceId];
          if (service.register) {
            service.register(service.value, register.type, register.value);
          }
        }
      }
    }
  }
}
