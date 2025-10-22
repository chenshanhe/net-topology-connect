import { ConfigManager } from '../utils/config';
import { ModuleManager } from './moduleManager/index';
import { DatabaseManager } from '../database/DatabaseManager';
import { ConnectManager } from './connectManager/index';

import {
  TerminalResponseErrorData,
  TerminalResponseData,
} from '../../shared/types';

import { initLogger, createLogger } from '../utils/logger';
import { ipcMain, ipcRenderer, BrowserWindow } from 'electron';
import dayjs from 'dayjs';

let configManager = ConfigManager.getInstance();
let moduleManager = ModuleManager.getInstance();
let connectManager = ConnectManager.getInstance();

let logger: any = null;

export const init = async () => {
  await appInit();
  await eventInit();
  await ipcInit();
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

export const eventInit = async () => {
  try {
    // 初始化事件
    connectManager.on('CONNECT.RESPONSE.ERROR', (uuid, error) => {
      sendMsgToAllWindows(`terminal.${uuid}.response.error`, {
        type: 'response.error',
        timestamp: dayjs().valueOf(),
        connId: uuid,
        content: error,
      } as TerminalResponseErrorData);
    });

    connectManager.on('CONNECT.RESPONSE', (uuid, response) => {
      sendMsgToAllWindows(`terminal.${uuid}.response`, {
        type: 'response',
        timestamp: dayjs().valueOf(),
        connId: uuid,
        content: response,
      } as TerminalResponseData);
    });
    logger.info('Event initialized');
  } catch (error) {
    console.error('Event initialization failed', error);
  }
};
// import fs from 'fs';
// import path from 'path';
// import os from 'os';
export const ipcInit = async () => {
  try {
    // 初始化 IPC
    // ipcMain.on('ipc-example', async (event, arg) => {
    //   const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
    //   logger?.info(msgTemplate(arg));
    //   event.reply('ipc-example', msgTemplate('pong'));
    // });
    // ipcMain.on('terminal.input', async (event, arg) => {
    //   console.log('Renderer Terminal input:',event, arg);
    // });

    ipcMain.on('terminal.command', async (event, arg) => {
      console.log('Renderer Terminal command:', arg);
      connectManager.sendCommand(arg.connId, arg.content);
    });

    // try {
    //   connectManager.connect({
    //     uuid: '1234567890',
    //     host: '111.230.81.91',
    //     port: 22,
    //     username: 'ubuntu',
    //     password: 'Amazing!',
    //     privateKey: fs.readFileSync(
    //       path.join(os.homedir(), '.ssh', 'id_ed25519'),
    //       'utf8',
    //     ),
    //   });
    // } catch (error) {
    //   console.error('Connection initialization failed', error);
    // }

    logger?.info('IPC initialized');
  } catch (error) {
    console.error('IPC initialization failed', error);
  }
};

const sendMsgToAllWindows = (eventName: string, msg: any) => {
  const windows = BrowserWindow.getAllWindows();

  for (const window of windows) {
    window.webContents.send(eventName, msg);
  }
};
