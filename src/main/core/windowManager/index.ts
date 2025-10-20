import path from 'path';
import { app, BrowserWindow, shell } from 'electron';
import { resolveHtmlPath } from './util';
import MenuBuilder from './menu';

import { createLogger } from '../../utils/logger';
const logger = createLogger('windowManager');

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

export class WindowManager {
  private static instance: WindowManager;
  private _windows: Record<string, BrowserWindow> = {};
  private constructor() {}

  public static getInstance(): WindowManager {
    if (!WindowManager.instance) {
      WindowManager.instance = new WindowManager();
    }
    return WindowManager.instance;
  }

  public createWindow = async (
    windowName: string,
    width: number,
    height: number,
  ) => {
    logger.debug('[createWindow]:', this._windows);
    if (this._windows[windowName]) {
      return;
    }

    if (isDebug) {
      await this._installExtensions();
    }

    const RESOURCES_PATH = app.isPackaged
      ? path.join(process.resourcesPath, 'assets')
      : path.join(__dirname, '../../assets');

    const getAssetPath = (...paths: string[]): string => {
      return path.join(RESOURCES_PATH, ...paths);
    };
    let newWindow = new BrowserWindow({
      show: false,
      width: width,
      height: height,
      icon: getAssetPath('icon.png'),
      webPreferences: {
        preload: app.isPackaged
          ? path.join(__dirname, 'preload.js')
          : path.join(__dirname, '../../.erb/dll/preload.js'),
      },
    });
    newWindow.loadURL(resolveHtmlPath('index.html'));
    newWindow.on('ready-to-show', () => {
      if (!newWindow) {
        throw new Error('"mainWindow" is not defined');
      }
      if (process.env.START_MINIMIZED) {
        newWindow.minimize();
      } else {
        newWindow.show();
      }
    });

    const menuBuilder = new MenuBuilder(newWindow);
    menuBuilder.buildMenu();

    // Open urls in the user's browser
    newWindow.webContents.setWindowOpenHandler((edata) => {
      shell.openExternal(edata.url);
      return { action: 'deny' };
    });
    this._windows[windowName] = newWindow;
  };

  public getWindow(windowName: string) {
    return this._windows[windowName];
  }

  private _installExtensions = async () => {
    const installer = require('electron-devtools-installer');
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
    const extensions = ['REACT_DEVELOPER_TOOLS'];

    return installer
      .default(
        extensions.map((name) => installer[name]),
        forceDownload,
      )
      .catch(console.log);
  };
}
