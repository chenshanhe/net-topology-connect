import { ConfigManager } from '../utils/config';
import { ModuleManager } from './moduleManager/index';
import { initLogger, createLogger } from '../utils/logger';
import { ipcMain } from 'electron';

let configManager = ConfigManager.getInstance();
let moduleManager = ModuleManager.getInstance();

let logger: any = null;

export const init = () => {
  appInit();
  eventInit();
  ipcInit();
};

export const appInit = () => {
  try {
    // 初始化配置
    configManager.init();
    moduleManager.moduleInitialized('config');

    // 初始化日志
    const loggerConfig = configManager.getLoggerConfig();
    initLogger(loggerConfig);
    moduleManager.moduleInitialized('logger');

    logger = createLogger('system');

    logger.info('Application initialized');
    logger.info(moduleManager.getPrintStr());
  } catch (error) {
    console.error('App initialization failed', error);
  }
};

export const eventInit = () => {
  try {
    // 初始化事件

    logger?.info('Event initialized');
  } catch (error) {
    console.error('Event initialization failed', error);
  }
};

export const ipcInit = () => {
  try {
    // 初始化 IPC
    ipcMain.on('ipc-example', async (event, arg) => {
      const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
      logger?.info(msgTemplate(arg));
      event.reply('ipc-example', msgTemplate('pong'));
    });

    logger?.info('IPC initialized');
  } catch (error) {
    console.error('IPC initialization failed', error);
  }
};
