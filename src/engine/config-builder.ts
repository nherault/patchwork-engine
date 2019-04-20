import { featureFlag } from '../utils/utils';
import { EngineConfig, initialConfig, PluginConfig } from './engine.type';

export class ConfigBuilder {
    private config: EngineConfig;

    constructor(sourceConfig?: EngineConfig) {
        this.config = sourceConfig ? sourceConfig : initialConfig;
    }

    public setNameAndVersion(name: string, version: string): ConfigBuilder {
        this.config.name = name;
        this.config.version = version;
        return this;
    }

    public addPlugin(plugin: PluginConfig, parameters?: any): ConfigBuilder {
        // TODO:
        // - Manage Prefix?
        // - Add Parameters without override all object (use deep copy?)
        // - log for override
        featureFlag(plugin.services !== undefined, () => this.addToConfig('services', plugin.services));
        featureFlag(plugin.getters !== undefined, () => this.addToConfig('getters', plugin.getters));
        featureFlag(plugin.actions !== undefined, () => this.addToConfig('actions', plugin.actions));
        featureFlag(plugin.parameters !== undefined, () => this.addToConfig('parameters', plugin.parameters));
        featureFlag(parameters !== undefined, () => this.addToConfig('parameters', parameters));
        featureFlag(plugin.registers !== undefined, () => this.addToConfig('registers', plugin.registers));
        if (plugin.hooks) {
            this.config.hooks = this.config.hooks.concat(plugin.hooks);
        }
        return this;
    }

    public addPlugins(plugins: Plugin[]): ConfigBuilder {
        plugins.forEach(plugin => this.addPlugin(plugin));
        return this;
    }

    public getConfig(): EngineConfig {
        return this.config;
    }

    private addToConfig(type: string, value: any) {
        this.config[type] = {
            ...this.config[type],
            ...value,
        };
        return this;
    }
}
