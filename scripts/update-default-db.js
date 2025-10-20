#!/usr/bin/env node

/* eslint-disable */

/**
 * 自动更新默认数据库文件脚本
 * 在数据库结构变更后自动更新默认数据库文件
 */

const fs = require('fs');
const path = require('path');
const { shouldUpdateDefaultDb, markAsUpdated } = require('./check-db-changes');

console.log('🔄 检查数据库结构变化...');

try {
  // 检查是否需要更新
  if (!shouldUpdateDefaultDb()) {
    console.log('✅ 默认数据库文件是最新的，跳过更新');
    return;
  }

  console.log('🔄 更新默认数据库文件...');

  const sourceDb = path.join(__dirname, '../prisma/net-topology-connect.db');
  const targetDb = path.join(__dirname, '../assets/database/default.db');

  // 检查源数据库文件是否存在
  if (!fs.existsSync(sourceDb)) {
    console.log('⚠️  源数据库文件不存在，跳过更新');
    return;
  }

  // 确保目标目录存在
  const targetDir = path.dirname(targetDb);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // 复制数据库文件到默认数据库
  fs.copyFileSync(sourceDb, targetDb);

  // 复制数据库文件到开发数据库
  const devDb = path.join(__dirname, '../assets/database/dev.db');
  fs.copyFileSync(sourceDb, devDb);

  // 标记为已更新
  markAsUpdated();

  // 获取文件大小信息
  const stats = fs.statSync(targetDb);
  const fileSizeKB = Math.round(stats.size / 1024);

  console.log(`✅ 默认数据库文件已更新: ${targetDb}`);
  console.log(`✅ 开发数据库文件已更新: ${devDb}`);
  console.log(`📊 文件大小: ${fileSizeKB} KB`);

  // 检查是否有数据
  const { execSync } = require('child_process');
  try {
    const result = execSync('npx prisma db execute --stdin', {
      input: 'SELECT COUNT(*) as count FROM Device;',
      encoding: 'utf8',
    });
    console.log(`📈 数据库统计: ${result.trim()}`);
  } catch {
    console.log('📝 数据库结构已更新');
  }
} catch (error) {
  console.error('❌ 更新默认数据库文件失败:', error.message);
  process.exit(1);
}
