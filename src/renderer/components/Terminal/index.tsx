import React, { useEffect, useRef } from 'react';
import { Terminal as XTerm } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import { TerminalInputData } from '@shared/types';
import dayjs from 'dayjs';
interface TerminalProps {
  className: string;
}

function Terminal({
  className = '',
}: TerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);

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
      console.log('Terminal input:', data);
      terminal.write(data);
      const event:TerminalInputData = {
        connId:'1234567890',
        type: 'input',
        timestamp: dayjs().valueOf(),
        content: data
      }
      window.electron.ipcRenderer.sendMessage('terminal.input', event);
    });

    // 监听按键
    terminal.onKey(({ key }) => {
      console.log('Key pressed:', key);
    });

    // 初始欢迎信息
    terminal.writeln('Welcome to NetTopologyConnect Terminal');
    terminal.writeln('Type "help" for available commands');
    terminal.write('$ ');

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
