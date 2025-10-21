import type {
  TerminalInputData,
} from '../types';

// IPC消息类型映射
export interface IPCMessageMap {
  'terminal.input': TerminalInputData;
}
