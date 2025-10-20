# Net Topology Connect

一个基于 Electron + React 的网络拓扑连接工具，用于可视化和管理网络拓扑结构。

## 技术栈

- **Electron** - 跨平台桌面应用框架
- **React 19** - 现代化前端 UI 框架
- **TypeScript** - 类型安全的 JavaScript
- **Webpack** - 模块打包工具
- **Sass** - CSS 预处理器

## 开发环境要求

- Node.js >= 14.x
- npm >= 7.x

## 快速开始

### 安装依赖

```bash
npm install
```

### 数据库初始化

首次拉取项目后，需要初始化数据库：

```bash
# 生成 Prisma 客户端
npm run db:generate

# 推送数据库结构到开发数据库
npm run db:push

# 更新默认数据库文件（用于打包）
npm run db:update-default
```

### 开发模式

```bash
npm start
```

### 构建应用

```bash
npm run package
```

### 代码检查

```bash
npm run lint
```

### 运行测试

```bash
npm test
```

## 项目结构

```
net-topology-connect/
├── src/
│   ├── main/           # Electron 主进程
│   ├── renderer/       # React 渲染进程
│   └── __tests__/      # 测试文件
├── assets/             # 静态资源
├── release/           # 构建输出
└── package.json       # 项目配置
```

## 数据库管理

### 数据库结构

项目使用 Prisma + SQLite 作为数据库，包含以下表：

- **Scene** - 场景管理
- **Device** - 设备信息
- **Connection** - 设备连接关系
- **ScanHistory** - 扫描历史记录

### 数据库命令

```bash
# 生成 Prisma 客户端
npm run db:generate

# 推送数据库结构（开发用）
npm run db:push

# 创建数据库迁移
npm run db:migrate

# 打开数据库管理界面
npm run db:studio

# 重置数据库
npm run db:reset

# 更新默认数据库文件
npm run db:update-default

# 检查数据库状态
npm run db:check
```

### 数据库更新流程

当修改 `prisma/schema.prisma` 文件后：

```bash
# 方法1：推送模式（推荐开发使用）
npm run db:push

# 方法2：迁移模式（推荐生产使用）
npm run db:migrate
```

两种方法都会自动更新 `assets/database/default.db` 和 `assets/database/dev.db` 文件。

## 开发指南

### 主进程开发

主进程代码位于 `src/main/` 目录，负责：

- 应用程序生命周期管理
- 窗口创建和管理
- 系统级 API 调用
- IPC 通信
- 数据库管理

### 渲染进程开发

渲染进程代码位于 `src/renderer/` 目录，负责：

- 用户界面展示
- 用户交互处理
- 与主进程通信

### 添加新功能

1. 在 `src/renderer/` 中创建 React 组件
2. 在 `src/main/` 中添加必要的 IPC 处理
3. 更新路由配置
4. 添加相应的测试

## 构建和分发

### 完整打包流程

#### 1. 预打包检查

```bash
# 检查数据库状态
npm run db:check

# 如果数据库需要更新
npm run db:update-default
```

#### 2. 构建应用

```bash
# 构建主进程和渲染进程
npm run build
```

#### 3. 打包应用

```bash
# 生成安装包（包含数据库文件）
npm run package
```

#### 4. 验证打包结果

```bash
# 检查构建产物
ls release/build/

# 检查数据库文件是否包含
ls release/build/win-unpacked/resources/assets/database/
```

**注意**: 打包过程中可能会有 DLL 构建警告，这是正常的，不影响最终安装包。

### 数据库文件说明

- **开发环境**: `prisma/net-topology-connect.db` - 开发时使用的数据库
- **默认数据库**: `assets/database/default.db` - 打包时包含的默认数据库
- **开发数据库**: `assets/database/dev.db` - 开发环境数据库（不包含在打包中）

### 平台特定构建

- **Windows**: 生成 NSIS 安装包
- **macOS**: 生成 DMG 镜像
- **Linux**: 生成 AppImage

### 打包产物说明

构建完成后，在 `release/build/` 目录下会生成：

- **Windows**: `NetTopologyConnect Setup 0.0.1.exe` - 安装程序
- **macOS**: `NetTopologyConnect-0.0.1.dmg` - 磁盘镜像
- **Linux**: `NetTopologyConnect-0.0.1.AppImage` - 可执行文件

### 安装包特性

#### Windows 安装包特性

- ✅ **用户可选择安装路径** - 允许用户自定义安装目录
- ✅ **桌面快捷方式** - 自动创建桌面快捷方式
- ✅ **开始菜单快捷方式** - 添加到开始菜单
- ✅ **自定义图标** - 使用项目图标
- ✅ **数据库文件包含** - 默认数据库文件已包含在安装包中

## 贡献指南

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 联系方式

- 项目链接: [https://github.com/your-username/net-topology-connect](https://github.com/your-username/net-topology-connect)
- 问题反馈: [https://github.com/your-username/net-topology-connect/issues](https://github.com/your-username/net-topology-connect/issues)

## 致谢

本项目基于 [Electron React Boilerplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate) 构建。

感谢 Electron React Boilerplate 团队提供的优秀模板和开发工具链。

## 更新日志

查看 [CHANGELOG.md](CHANGELOG.md) 了解版本更新历史。
