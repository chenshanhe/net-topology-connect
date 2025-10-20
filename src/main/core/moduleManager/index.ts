import { Module, ModuleInitStatus } from '../../types/Module.type';
export class ModuleManager {
  private static instance: ModuleManager;
  private _modules: Module[] = [
    {
      name: 'config',
      description: 'ConfigManager',
      initStatus: ModuleInitStatus.READY,
    },
    {
      name: 'logger',
      description: 'Logger',
      initStatus: ModuleInitStatus.READY,
    },
    {
      name: 'database',
      description: 'Database',
      initStatus: ModuleInitStatus.READY,
    },

    {
      name: 'window',
      description: 'WindowManager',
      initStatus: ModuleInitStatus.SKIPPED,
    },
  ];
  private constructor() {}

  public static getInstance(): ModuleManager {
    if (!ModuleManager.instance) {
      ModuleManager.instance = new ModuleManager();
    }
    return ModuleManager.instance;
  }

  public getModules() {
    return this._modules;
  }

  public getPrintStr(): string {
    if (this._modules.length === 0) {
      return '\n📋 No modules registered\n';
    }

    // 计算列宽 - 增加最小宽度
    const nameWidth = Math.max(10, ...this._modules.map((m) => m.name.length));
    const descWidth = Math.max(
      16,
      ...this._modules.map((m) => m.description?.length || 0),
    );
    const statusWidth = Math.max(
      12,
      ...this._modules.map((m) => m.initStatus.length),
    );

    // 表头
    let table = '\n📋 Module Status Report\n';

    // 顶部边框
    table += `┌${'─'.repeat(nameWidth + 2)}┬${'─'.repeat(descWidth + 2)}┬${'─'.repeat(statusWidth + 2)}┐\n`;

    // 表头
    table += `│ ${'模块'.padEnd(nameWidth)} │ ${'说明'.padEnd(descWidth)} │ ${'状态'.padEnd(statusWidth)} │\n`;

    // 分隔线
    table += `├${'─'.repeat(nameWidth + 2)}┼${'─'.repeat(descWidth + 2)}┼${'─'.repeat(statusWidth + 2)}┤\n`;

    // 数据行 - 按数组顺序
    for (const module of this._modules) {
      const name = module.name.padEnd(nameWidth);
      const description = (module.description || '').padEnd(descWidth);
      const status = module.initStatus.padEnd(statusWidth);

      table += `│ ${name} │ ${description} │ ${status} │\n`;
    }

    // 底部边框
    table += `└${'─'.repeat(nameWidth + 2)}┴${'─'.repeat(descWidth + 2)}┴${'─'.repeat(statusWidth + 2)}┘\n`;

    return table;
  }

  public setModules(moduleName: string, module: Module) {
    const existingIndex = this._modules.findIndex((m) => m.name === moduleName);
    if (existingIndex >= 0) {
      this._modules[existingIndex] = module;
    } else {
      this._modules.push(module);
    }
  }

  public initModules(module: Module) {
    const existingIndex = this._modules.findIndex(
      (m) => m.name === module.name,
    );
    if (existingIndex >= 0) {
      this._modules[existingIndex] = module;
    } else {
      this._modules.push(module);
    }
  }

  public moduleInitialized(moduleName: string) {
    const module = this._modules.find((m) => m.name === moduleName);
    if (module) {
      module.initStatus = ModuleInitStatus.INITIALIZED;
    }
  }
}
