// 共享的IPC通道类型
export type IPCChannels = 'terminal.input'

export type TemplateData = {
  connId: string;
  type:'input'
  timestamp: number;
  content: string;
}

// 终端输入数据
export interface TerminalInputData extends TemplateData {
  type: 'input';
}
