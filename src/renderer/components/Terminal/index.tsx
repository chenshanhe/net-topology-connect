import React, { useEffect, useRef } from 'react';
import { Terminal as XTerm } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import {
  TerminalCommandData,
  TerminalResponseErrorData,
  TerminalResponseData,
} from '@shared/types';
import dayjs from 'dayjs';

interface TerminalProps {
  className: string;
  connId: string;
}

function Terminal({ className = '', connId = '' }: TerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const currentLineRef = useRef<string>('');

  useEffect(() => {
    if (!terminalRef.current) return;

    // 创建 xterm 实例
    const terminal = new XTerm({
      theme: {
        background: '#1e1e1e',
        foreground: '#ffffff',
        cursor: '#ffffff',
      },
      fontSize: 14,
      fontFamily: 'Consolas, "Courier New", monospace',
      cursorBlink: true,
      cursorStyle: 'block',
      scrollback: 1000,
    });

    // 创建 fit addon
    const fitAddon = new FitAddon();
    terminal.loadAddon(fitAddon);

    // 挂载到 DOM
    terminal.open(terminalRef.current);
    fitAddon.fit();

    // 保存引用
    xtermRef.current = terminal;
    fitAddonRef.current = fitAddon;

    // 监听数据输入
    terminal.onData((data) => {
      // 处理特殊字符
      if (data === '\r') {
        // 回车键 - 执行命令
        terminal.write('\r\n');
        const command = currentLineRef.current.trim();
        console.log('command', command);

        // 发送到主进程处理
        const event: TerminalCommandData = {
          connId,
          type: 'command',
          timestamp: dayjs().valueOf(),
          content: command,
        };
        window.electron.ipcRenderer.sendMessage(`terminal.command`, event);

        terminal.write('$ ');
        currentLineRef.current = '';
      } else if (data === '\u007f') {
        // 退格键
        if (currentLineRef.current.length > 0) {
          currentLineRef.current = currentLineRef.current.slice(0, -1);
          terminal.write('\b \b'); // 退格并清除字符
        }
      } else if (data >= ' ') {
        // 可打印字符
        currentLineRef.current += data;
        terminal.write(data);
      }
    });

    // 监听按键
    terminal.onKey((event) => {
      // 可以在这里处理特殊按键，如 Ctrl+C, Ctrl+D 等
      if (event.domEvent.ctrlKey && event.key === 'c') {
        // 处理 Ctrl+C
      }
    });

    // 初始欢迎信息
    terminal.writeln('Welcome to NetTopologyConnect Terminal');
    terminal.writeln('Type "help" for available commands');
    terminal.write('$ ');

    window.electron?.ipcRenderer.onTerminalEvent(
      connId,
      'response.error',
      (...args: unknown[]) => {
        const arg = args[0] as TerminalResponseErrorData;
        terminal.writeln(`\x1b[31m${arg.content}\x1b[0m`);
      },
    );

    window.electron?.ipcRenderer.onTerminalEvent(
      connId,
      'response',
      (...args: unknown[]) => {
        const arg = args[0] as TerminalResponseData;
        terminal.write(arg.content);
      },
    );
    // 清理函数
    // eslint-disable-next-line consistent-return
    return () => {
      terminal.dispose();
    };
  });

  // 窗口大小变化时重新调整
  useEffect(() => {
    const handleResize = () => {
      if (fitAddonRef.current) {
        fitAddonRef.current.fit();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      ref={terminalRef}
      className={`terminal-container ${className}`}
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#1e1e1e',
      }}
    />
  );
}

export default Terminal;
