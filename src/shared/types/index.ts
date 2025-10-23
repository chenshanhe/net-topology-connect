// 共享的IPC通道类型
export type IPCChannels =
  | 'terminal.input'
  | 'terminal.command'
  | 'terminal.response'
  | 'terminal.response.error'
  | 'window:minimize'
  | 'window:maximize'
  | 'window:close'
  | `terminal.${string}.response`
  | `terminal.${string}.response.error`;

export type TemplateData = {
  connId: string;
  type: 'input' | 'output' | 'command' | 'response' | 'response.error';
  timestamp: number;
  content: string;
};

// 终端输入数据
export interface TerminalInputData extends TemplateData {
  type: 'input';
}

export interface TerminalCommandData extends TemplateData {
  type: 'command';
}

export interface TerminalResponseData extends TemplateData {
  type: 'response';
}

export interface TerminalResponseErrorData extends TemplateData {
  type: 'response.error';
}
