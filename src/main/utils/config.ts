import * as fs from 'fs';
import * as path from 'path';
import { app } from 'electron';
import { get } from 'lodash';
import { LoggerConfig } from '../types/LoggerConfig.type';
import { Module, ModuleInitStatus } from '../types/Module.type';

interface Config {
  logger: LoggerConfig;
}

/**
 * 配置文件读取器
 * 用于读取打包在应用中的配置文件
 */
export class ConfigManager {
  private static instance: ConfigManager;
  private assetsPath: string;
  private _config: Record<string, any> = {};
  private constructor() {
    // 获取 assets 目录路径
    this.assetsPath = app.isPackaged
      ? path.join(process.resourcesPath, 'assets')
      : path.join(__dirname, '../../assets');
  }

  /**
   * 获取单例实例
   */
  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  public init() {
    this._config = this.readConfig();
  }

  /**
   * 读取配置文件
   */
  public readConfig(): Config | {} {
    try {
      //判断环境
      let configName = 'default';
      const env = process.env.NODE_ENV || 'development';
      if (env === 'development') {
        configName = 'dev';
      }

      // 如果 default.json 不存在，尝试读取单独的配置文件
      const configPath = path.join(
        this.assetsPath,
        'etc',
        `${configName}.json`,
      );

      if (!fs.existsSync(configPath)) {
        console.warn(`Config file not found: ${configPath}`);
        return {};
      }

      let configDataString = fs.readFileSync(configPath, 'utf8');
      return JSON.parse(configDataString) as Config;
    } catch (error) {
      console.error(`Failed to read config:`, error);
      return {};
    }
  }

  getLoggerConfig() {
    if (!this._config || !this._config.logger) {
      return {
        level: 'info',
        enableConsole: true,
        enableFile: true,
      } as LoggerConfig;
    }
    return this.getConfigByModule('logger') as LoggerConfig;
  }

  getConfigByModule(module: string) {
    return get(this._config, module, {}) as Record<string, any>;
  }
}
