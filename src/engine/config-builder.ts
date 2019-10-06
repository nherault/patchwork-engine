import { computeOrDefault, featureFlag, logDebug, logErr, logWarn } from '../utils/utils';
import { Action } from './action.type';
import { ConfigResult, EngineConfig, initialConfig, PluginConfig, PluginRequired } from './engine.type';

export class ConfigBuilder {
    private config: EngineConfig;
    private errors: string[];
    private warnings: string[];

    constructor(sourceConfig?: EngineConfig) {
        this.config = sourceConfig ? sourceConfig : initialConfig;
        this.errors = [];
        this.warnings = [];
    }

    public setNameAndVersion(name: string, version: string): ConfigBuilder {
        this.config.name = name;
        this.config.version = version;
        return this;
    }

    public addPlugin(plugin: PluginConfig, parameters?: any): ConfigBuilder {
        // TODO:
        // - Add Parameters without override all object (use deep copy?)
        computeOrDefault(plugin.required, (required: PluginRequired) => this.checkPluginRequired(plugin, required));
        featureFlag(plugin.services !== undefined, () => this.addToConfig(plugin, 'services'));
        featureFlag(plugin.getters !== undefined, () => this.addToConfig(plugin, 'getters'));
        featureFlag(plugin.actions !== undefined, () => this.addToConfig(plugin, 'actions'));
        featureFlag(plugin.parameters !== undefined, () => this.addToConfig(plugin, 'parameters'));
        featureFlag(parameters !== undefined, () =>
            this.addToConfig({ name: `${plugin.name}-parameter-override`, version: '', parameters }, 'parameters'));
        computeOrDefault(plugin.inits, (inits: Action[]) => inits.forEach(init => this.config.inits.push(init)));
        if (plugin.hooks) {
            this.config.hooks = this.config.hooks.concat(plugin.hooks);
        }
        this.config.plugins = this.config.plugins || {};
        this.config.plugins[plugin.name] = plugin.version;
        return this;
    }

    public addPlugins(plugins: PluginConfig[]): ConfigBuilder {
        plugins.forEach(plugin => this.addPlugin(plugin));
        return this;
    }

    public log(): ConfigBuilder {
        this.errors.length === 0 ? logDebug('No Error') : this.errors.forEach(error => logErr(error));
        this.warnings.length === 0 ? logDebug('No Warnings') : this.warnings.forEach(warning => logWarn(warning));
        return this;
    }

    public build(callback?: (configResult: ConfigResult) => void): EngineConfig {
        computeOrDefault(callback, (safeCallback: (configResult: ConfigResult) => void) =>
            safeCallback({errors: this.errors, warnings: this.warnings, config: this.config }));
        return this.config;
    }

    private addToConfig(plugin: PluginConfig, type: string) {
        this.checkOverrides(plugin, type);
        this.config[type] = {
            ...this.config[type],
            ...plugin[type],
        };
        return this;
    }

    private checkPluginRequired(plugin: PluginConfig, required: PluginRequired): void {
        computeOrDefault(required.plugins, (requiredPlugins: {[key: string]: string }) =>
            this.checkPluginRequirement(plugin, requiredPlugins, 'plugins'));
        computeOrDefault(required.actions, (requiredAction: string[]) =>
            this.checkRequirement(plugin, requiredAction, 'actions'));
        computeOrDefault(required.getters, (requiredGetters: string[]) =>
            this.checkRequirement(plugin, requiredGetters, 'getters'));
        computeOrDefault(required.services, (requiredServices: string[]) =>
            this.checkRequirement(plugin, requiredServices, 'services'));
    }

    private checkRequirement(plugin: PluginConfig, required: string[], type: string): void {
        required.forEach((requiredToTest: string) => featureFlag(this.config[type][requiredToTest] === undefined, () =>
            this.errors.push(`@PatchworkEngine::checkRequirement[${plugin.name}:${plugin.version}]: ${type}[${requiredToTest}] unknown`)));
    }

    private checkOverrides(plugin: PluginConfig, type: string): void {
        const overridesToCheck: any = plugin[type];
        for (const key in overridesToCheck) {
            if (overridesToCheck[key]) {
                featureFlag(this.config[type][key] !== undefined, () =>
                    this.warnings.push(`@PatchworkEngine::checkOverrides[${plugin.name}:${plugin.version}]: ${type}[${key}] overrided`));
            }
        }
    }

    private checkPluginRequirement(plugin: PluginConfig, required: {[key: string]: string }, type: string): void {
        for (const key in required) {
            if (required[key]) {
                // TODO: check the version
                featureFlag(this.config[type][key] === undefined, () =>
                    this.errors.push(`@PatchworkEngine::checkRequirement[${plugin.name}:${plugin.version}]: ${type}[${key}] unknown`));
            }
        }
    }
}
