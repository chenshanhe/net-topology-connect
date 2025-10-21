import { ConfigManager } from '../utils/config';
import { ModuleManager } from './moduleManager/index';
import { DatabaseManager } from '../database/DatabaseManager';

import { initLogger, createLogger } from '../utils/logger';
import { ipcMain } from 'electron';

let configManager = ConfigManager.getInstance();
let moduleManager = ModuleManager.getInstance();

let logger: any = null;

export const init = async () => {
  await appInit();
  eventInit();
  ipcInit();
};

export const appInit = async () => {
  try {
    // 初始化配置
    configManager.init();
    moduleManager.moduleInitialized('config');

    // 初始化日志
    const loggerConfig = configManager.getLoggerConfig();
    initLogger(loggerConfig);
    moduleManager.moduleInitialized('logger');

    // 初始化数据库
    let databaseManager = DatabaseManager.getInstance();
    await databaseManager.init();
    moduleManager.moduleInitialized('database');

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
    ipcMain.on('terminal.input', async (event, arg) => {
      console.log('Renderer Terminal input:',event, arg);
    });



    logger?.info('IPC initialized');
  } catch (error) {
    console.error('IPC initialization failed', error);
  }
};
