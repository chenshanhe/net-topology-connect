import log from 'electron-log';
import { app } from 'electron';
import path from 'path';
import fs from 'fs';
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

  // 自定义日志目录：默认写入安装目录下的 log 目录
  try {
    const logDir = app.isPackaged
      ? path.join(process.resourcesPath, '..', 'log')
      : path.join(process.cwd(), 'log');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    // electron-log v5 自定义文件路径
    // 例如：C:\Program Files\NetTopologyConnect\log\main.log
    (log.transports.file as any).resolvePath = () =>
      path.join(logDir, 'main.log');
  } catch (e) {
    // 目录不可写时，回退到默认 userData 路径
  }

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
