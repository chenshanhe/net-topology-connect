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

## 开发指南

### 主进程开发

主进程代码位于 `src/main/` 目录，负责：

- 应用程序生命周期管理
- 窗口创建和管理
- 系统级 API 调用
- IPC 通信

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

### 本地构建

```bash
npm run package
```

构建产物将输出到 `release/build/` 目录。

### 平台特定构建

- **Windows**: 生成 NSIS 安装包
- **macOS**: 生成 DMG 镜像
- **Linux**: 生成 AppImage

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
