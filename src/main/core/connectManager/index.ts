import { Connection } from '../../types/Connection.type';
const { Client } = require('ssh2');
import { EventEmitter } from 'events';
import { createLogger } from '../../utils/logger';
const logger = createLogger('ConnectManager');

interface ConnectionRecord {
  connClient: typeof Client;
  stream: any;
  connMsg: Connection;
  status: 'ready' | 'connected' | 'disconnected';
}

export class ConnectManager extends EventEmitter {
  private static instance: ConnectManager;
  private _connections: Record<string, ConnectionRecord> = {};

  private constructor() {
    super();
  }

  public static getInstance(): ConnectManager {
    if (!ConnectManager.instance) {
      ConnectManager.instance = new ConnectManager();
    }
    return ConnectManager.instance;
  }

  public connect(connection: Connection) {
    this._connections[connection.uuid] = {
      connClient: null,
      stream: null,
      connMsg: connection,
      status: 'ready',
    };
    this._createConnection(connection.uuid);
  }

  private _createConnection(uuid: string) {
    const connection = this._connections[uuid];
    const conn = new Client();
    conn.on('ready', () => {
      conn.shell((err: any, stream: any) => {
        if (err) {
          return;
        }
        this._connections[uuid].stream = stream;
        this._connections[uuid].status = 'connected';
        this._connections[uuid].connClient = conn;
        stream
          .on('close', () => {
            logger.debug('Stream :: close');
            conn.end();
          })
          .on('data', (data: any) => {
            logger.debug('OUTPUT: ' + data);
            this.sendTerminalResponse(uuid, data);
          })
          .on('error', (err: any) => {
            logger.error('Stream error', err);
            this.disconnect(uuid);
          });
        // stream.end('ls -l\nexit\n');
      });
    });

    // 添加错误处理
    conn.on('error', (err: any) => {
      logger.error('Connection failed', err.message);
      this.sendTerminalResponseError(uuid, err.message);
      this.disconnect(uuid);
    });
    logger.log('Connection created', connection.connMsg);

    conn.connect({
      host: connection.connMsg.host,
      port: connection.connMsg.port,
      username: connection.connMsg.username,
      privateKey: connection.connMsg.privateKey,
      password: connection.connMsg.password,
    });
  }

  public disconnect(uuid: string) {
    const connection = this.getConnection(uuid);
    if (connection.connClient) {
      connection.connClient.end();
    }
    if (connection.stream) {
      connection.stream.end();
    }
    connection.connClient = null;
    connection.stream = null;
    connection.status = 'disconnected';
    setTimeout(() => {
      this.removeConnection(uuid);
    }, 60000);
  }

  public removeConnection(uuid: string) {
    delete this._connections[uuid];
  }

  public getConnection(uuid: string) {
    if (!this._connections[uuid]) {
      throw new Error(`Connection ${uuid} not found`);
    }
    return this._connections[uuid];
  }

  public sendCommand(uuid: string, command: string) {
    const connection = this.getConnection(uuid);
    if (connection.status !== 'connected') {
      throw new Error(`Connection ${uuid} is not connected`);
    }
    connection.stream.write(command + '\n');
  }

  sendTerminalResponseError(uuid: string, error: string) {
    this.emit('CONNECT.RESPONSE.ERROR', uuid, error);
  }

  sendTerminalResponse(uuid: string, response: string) {
    this.emit('CONNECT.RESPONSE', uuid, response);
  }
}
