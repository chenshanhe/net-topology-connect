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
