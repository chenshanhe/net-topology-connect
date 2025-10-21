// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import type { IPCChannels } from '../shared/types';

export type Channels = IPCChannels;

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
    // 支持动态事件监听
    onDynamic(channelPattern: string, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channelPattern, subscription);

      return () => {
        ipcRenderer.removeListener(channelPattern, subscription);
      };
    },
    // 监听终端相关事件
    onTerminalEvent(
      uuid: string,
      eventType: 'response' | 'response.error',
      func: (...args: unknown[]) => void,
    ) {
      console.log('Renderer onTerminalEvent:', uuid, eventType);
      const channel = `terminal.${uuid}.${eventType}` as Channels;
      return this.on(channel, func);
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
