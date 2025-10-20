#!/usr/bin/env node

/**
 * 检测数据库结构变化的脚本
 * 通过比较 schema 文件的修改时间来判断是否需要更新默认数据库
 */

const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, '../prisma/schema.prisma');
const defaultDbPath = path.join(__dirname, '../assets/database/default.db');
const lastUpdatePath = path.join(__dirname, '../assets/database/.last-update');

function getFileModTime(filePath) {
  if (!fs.existsSync(filePath)) return 0;
  return fs.statSync(filePath).mtime.getTime();
}

function shouldUpdateDefaultDb() {
  const schemaTime = getFileModTime(schemaPath);
  const defaultDbTime = getFileModTime(defaultDbPath);
  const lastUpdateTime = getFileModTime(lastUpdatePath);

  // 如果 schema 比默认数据库新，需要更新
  if (schemaTime > defaultDbTime) {
    return true;
  }

  // 如果默认数据库不存在，需要创建
  if (!fs.existsSync(defaultDbPath)) {
    return true;
  }

  return false;
}

function markAsUpdated() {
  const updateDir = path.dirname(lastUpdatePath);
  if (!fs.existsSync(updateDir)) {
    fs.mkdirSync(updateDir, { recursive: true });
  }

  fs.writeFileSync(lastUpdatePath, new Date().toISOString());
}

if (require.main === module) {
  if (shouldUpdateDefaultDb()) {
    console.log('🔄 检测到数据库结构变化，需要更新默认数据库');
    process.exit(1); // 退出码 1 表示需要更新
  } else {
    console.log('✅ 默认数据库文件是最新的');
    process.exit(0); // 退出码 0 表示不需要更新
  }
}

module.exports = { shouldUpdateDefaultDb, markAsUpdated };
