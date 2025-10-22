import { DatabaseManager } from '../../database/DatabaseManager';
import { PrismaClient, Prisma } from '@prisma/client';
import { Scene, CreateSceneInput } from '../../types/Scene.type';
import { SceneQuery } from '../../types/SceneQuery.type';
import { PageQuery } from '../../types/PageQuery.type';
import { PageQueryResp } from '../../types/PageQueryResp.type';
const databaseManager = DatabaseManager.getInstance();
export class SceneManager {
  private static instance: SceneManager;
  private prisma: PrismaClient;

  private constructor() {
    this.prisma = databaseManager.getClient();
  }

  public static getInstance(): SceneManager {
    if (!SceneManager.instance) {
      SceneManager.instance = new SceneManager();
    }
    return SceneManager.instance;
  }

  getQueryCondition(sceneQuery: SceneQuery): Prisma.SceneWhereInput {
    const where: Prisma.SceneWhereInput = {};

    if (sceneQuery.uuid) {
      where.uuid = { contains: sceneQuery.uuid };
    }

    if (sceneQuery.name) {
      where.name = { contains: sceneQuery.name };
    }

    return where;
  }

  public async getScenes(sceneQuery: SceneQuery) {
    return this.prisma.scene.findMany({
      where: this.getQueryCondition(sceneQuery),
    });
  }

  public async getScenesWithPagination(
    sceneQuery: SceneQuery,
    pageQuery: PageQuery,
  ): Promise<PageQueryResp<Scene>> {
    const skip = (pageQuery.page - 1) * pageQuery.pageSize;
    const where = this.getQueryCondition(sceneQuery);

    const [data, total] = await Promise.all([
      this.prisma.scene.findMany({
        where,
        skip,
        take: pageQuery.pageSize,
        orderBy: {
          name: 'asc',
        },
      }),
      this.prisma.scene.count({ where }),
    ]);

    return {
      page: pageQuery.page,
      pageSize: pageQuery.pageSize,
      total,
      totalPages: Math.ceil(total / pageQuery.pageSize),
      data: data as Scene[],
    };
  }

  public async createScene(scene: CreateSceneInput) {
    return this.prisma.scene.create({
      data: scene,
    });
  }
}
