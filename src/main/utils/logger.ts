import log from 'electron-log';
import { LoggerConfig } from '../types/LoggerConfig.type';

/**
 * 全局日志配置存储
 */
let globalConfig: LoggerConfig | null = null;

/**
 * 初始化全局日志配置
 */
export function initLogger(config: LoggerConfig): void {
  globalConfig = config;

  // 配置 electron-log
  log.transports.file.level = config.enableFile ? config.level : 'error';
  log.transports.console.level = config.enableConsole ? config.level : 'error';

  // 设置日志格式 - 包含模块名和完整时间
  log.transports.file.format =
    '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]{scope} {text}';
  log.transports.console.format =
    '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]{scope} {text}';

  console.log('Logger initialized with config:', config);
}

/**
 * 创建模块日志实例
 */
export function createLogger(module: string = 'default') {
  return log.scope(module);
}
