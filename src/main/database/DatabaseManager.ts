import { PrismaClient } from '@prisma/client';
import { createLogger } from '../utils/logger';
import { app } from 'electron';
import path from 'path';
import fs from 'fs';

const logger = createLogger('db');

export class DatabaseManager {
  private static instance: DatabaseManager;
  private prisma: PrismaClient;

  private constructor() {
    // 生产环境数据库路径配置
    const isPackaged = process.env.NODE_ENV === 'production';
    let databaseUrl = process.env.DATABASE_URL;

    if (isPackaged && !databaseUrl) {
      const { app } = require('electron');
      const userDataPath = app.getPath('userData');
      const dbPath = require('path').join(
        userDataPath,
        'net-topology-connect.db',
      );
      databaseUrl = `file:${dbPath}`;
    }

    this.prisma = new PrismaClient({
      datasources: databaseUrl ? { db: { url: databaseUrl } } : undefined,
      log: [
        {
          emit: 'event',
          level: 'query',
        },
        {
          emit: 'event',
          level: 'error',
        },
        {
          emit: 'event',
          level: 'info',
        },
        {
          emit: 'event',
          level: 'warn',
        },
      ],
    });

    // 监听 Prisma 日志事件
    this.prisma.$on('query', (e: any) => {
      logger.debug(`Query: ${e.query}`);
    });

    this.prisma.$on('error', (e: any) => {
      logger.error(`Prisma Error: ${e.message}`);
    });
  }

  public static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  /**
   * 初始化数据库
   */
  public async init(): Promise<void> {
    try {
      // 确保数据库文件存在
      await this.ensureDatabaseExists();

      // 测试数据库连接
      await this.prisma.$connect();
      logger.info('Prisma database connected successfully');
    } catch (error) {
      logger.error('Failed to connect to database:', error);
      throw error;
    }
  }

  /**
   * 确保数据库文件存在，如果不存在则从默认文件复制
   */
  private async ensureDatabaseExists(): Promise<void> {
    const isPackaged = app.isPackaged;
    const userDataPath = app.getPath('userData');
    const dbPath = path.join(userDataPath, 'net-topology-connect.db');

    // 如果数据库文件已存在，直接返回
    if (fs.existsSync(dbPath)) {
      return;
    }

    // 确保用户数据目录存在
    if (!fs.existsSync(userDataPath)) {
      fs.mkdirSync(userDataPath, { recursive: true });
    }

    // 从默认数据库文件复制
    const defaultDbPath = isPackaged
      ? path.join(process.resourcesPath, 'assets', 'database', 'default.db')
      : path.join(__dirname, '../../../assets/database/default.db');

    if (fs.existsSync(defaultDbPath)) {
      fs.copyFileSync(defaultDbPath, dbPath);
      logger.info(`Database initialized from default file: ${dbPath}`);
    } else {
      // 如果默认文件不存在，创建空数据库
      logger.warn('Default database file not found, creating empty database');
      // 这里可以运行 prisma migrate deploy 来创建数据库结构
    }
  }

  /**
   * 获取 Prisma 客户端
   */
  public getClient(): PrismaClient {
    return this.prisma;
  }

  /**
   * 设备相关操作
   */
  public async addDevice(device: {
    name: string;
    ipAddress: string;
    macAddress?: string;
    deviceType?: string;
    status?: string;
  }) {
    try {
      const result = await this.prisma.device.create({
        data: {
          name: device.name,
          ipAddress: device.ipAddress,
          macAddress: device.macAddress,
          deviceType: device.deviceType,
          status: device.status || 'unknown',
          lastSeen: new Date(),
        },
      });

      logger.info(`Device added: ${device.name} (${device.ipAddress})`);
      return result;
    } catch (error) {
      logger.error('Failed to add device:', error);
      throw error;
    }
  }

  public async getDevices() {
    try {
      return await this.prisma.device.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      logger.error('Failed to get devices:', error);
      throw error;
    }
  }

  public async updateDeviceStatus(id: number, status: string) {
    try {
      await this.prisma.device.update({
        where: { id },
        data: {
          status,
          lastSeen: new Date(),
        },
      });
      logger.info(`Device status updated: ${id} -> ${status}`);
    } catch (error) {
      logger.error('Failed to update device status:', error);
      throw error;
    }
  }

  /**
   * 连接相关操作
   */
  public async addConnection(connection: {
    sourceDeviceId: number;
    targetDeviceId: number;
    connectionType?: string;
    bandwidth?: string;
    latency?: number;
  }) {
    try {
      const result = await this.prisma.connection.create({
        data: {
          sourceDeviceId: connection.sourceDeviceId,
          targetDeviceId: connection.targetDeviceId,
          connectionType: connection.connectionType,
          bandwidth: connection.bandwidth,
          latency: connection.latency,
        },
      });

      logger.info(
        `Connection added: ${connection.sourceDeviceId} -> ${connection.targetDeviceId}`,
      );
      return result;
    } catch (error) {
      logger.error('Failed to add connection:', error);
      throw error;
    }
  }

  public async getConnections() {
    try {
      return await this.prisma.connection.findMany({
        include: {
          sourceDevice: true,
          targetDevice: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      logger.error('Failed to get connections:', error);
      throw error;
    }
  }

  /**
   * 扫描历史相关操作
   */
  public async addScanHistory(scan: {
    scanType: string;
    targetRange?: string;
    devicesFound?: number;
    scanDuration?: number;
    status?: string;
  }) {
    try {
      const result = await this.prisma.scanHistory.create({
        data: {
          scanType: scan.scanType,
          targetRange: scan.targetRange,
          devicesFound: scan.devicesFound || 0,
          scanDuration: scan.scanDuration,
          status: scan.status || 'completed',
        },
      });

      logger.info(`Scan history added: ${scan.scanType}`);
      return result;
    } catch (error) {
      logger.error('Failed to add scan history:', error);
      throw error;
    }
  }

  public async getScanHistory() {
    try {
      return await this.prisma.scanHistory.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      logger.error('Failed to get scan history:', error);
      throw error;
    }
  }

  /**
   * 关闭数据库连接
   */
  public async close(): Promise<void> {
    try {
      await this.prisma.$disconnect();
      logger.info('Prisma database connection closed');
    } catch (error) {
      logger.error('Failed to close database connection:', error);
      throw error;
    }
  }
}
