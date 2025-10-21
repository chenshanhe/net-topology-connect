import type {
  TerminalInputData,
  TerminalCommandData,
  TerminalResponseData,
  TerminalResponseErrorData,
} from '../types';

// IPC消息类型映射
export interface IPCMessageMap {
  'terminal.input': TerminalInputData;
  'terminal.command': TerminalCommandData;
  'terminal.response': TerminalResponseData;
  'terminal.response.error': TerminalResponseErrorData;
}
