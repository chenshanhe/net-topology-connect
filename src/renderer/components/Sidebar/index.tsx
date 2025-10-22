import React, { useState } from 'react';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Drawer,
  Box,
  Typography,
  Divider,
  Collapse,
  IconButton,
  Menu,
  MenuItem as MuiMenuItem,
  Tooltip,
} from '@mui/material';
import {
  Home,
  Settings,
  Help,
  Hub,
  OfflineBolt,
  MoreVert,
  Clear,
  List as ListIcon,
  ArrowDropUp,
  ArrowDropDown,
  ChevronLeft,
  ChevronRight,
} from '@mui/icons-material';
import RecentConnections, {
  RecentConnection,
  RecentConnectionsHover,
} from './RecentConnections';

interface SidebarProps {
  width: number;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

// 菜单类型枚举
export enum MenuItemType {
  SIMPLE = 'simple', // 普通菜单，无子菜单
  DROPDOWN = 'dropdown', // 有子菜单的菜单
  COMPONENT = 'component', // 有子组件的菜单（如快速连接）
}

// 子组件配置
export interface SubComponentConfig {
  type: 'recent-connections' | 'custom';
  data?: RecentConnection[];
  component?: React.ComponentType<any>;
}

// 操作按钮配置
export interface ActionConfig {
  icon: React.ReactNode;
  tooltip: string;
  onClick: () => void;
}

// 菜单项接口
export interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  type: MenuItemType;
  children?: MenuItem[]; // 子菜单（dropdown类型使用）
  subComponent?: SubComponentConfig; // 子组件配置（component类型使用）
  actions?: ActionConfig[]; // 操作按钮（component类型使用）
  tooltip?: string; // 自定义tooltip
}

const menuItems: MenuItem[] = [
  {
    id: 'home',
    label: '首页',
    icon: <Home />,
    path: '/',
    type: MenuItemType.SIMPLE,
  },
  {
    id: 'topology',
    label: '拓扑',
    icon: <Hub />,
    path: '/topology',
    type: MenuItemType.SIMPLE,
  },
  {
    id: 'quick-connect',
    label: '快速连接',
    icon: <OfflineBolt />,
    path: '/quick-connect',
    type: MenuItemType.COMPONENT,
    subComponent: {
      type: 'recent-connections',
      data: [
        {
          id: '1',
          name: '测试服务器',
          host: '192.168.1.100',
          port: 22,
          type: 'SSH',
        },
        {
          id: '2',
          name: '开发服务器',
          host: '192.168.1.101',
          port: 22,
          type: 'SSH',
        },
      ], // 示例数据
    },
    actions: [
      {
        icon: <Clear fontSize="small" />,
        tooltip: '清空记录',
        onClick: () => {
          // 清空记录逻辑
        },
      },
      {
        icon: <ListIcon fontSize="small" />,
        tooltip: '查看完整记录',
        onClick: () => {
          // 查看完整记录逻辑
        },
      },
    ],
  },
  {
    id: 'settings',
    label: '设置',
    icon: <Settings />,
    path: '/settings',
    type: MenuItemType.SIMPLE,
  },
  {
    id: 'help',
    label: '帮助',
    icon: <Help />,
    path: '/help',
    type: MenuItemType.SIMPLE,
  },
  {
    id: 'topology1',
    label: '拓扑',
    icon: <Hub />,
    path: '/topology',
    type: MenuItemType.DROPDOWN,
    children: [
      {
        id: 'topology-a',
        label: '子菜单A',
        icon: <Hub />,
        path: '/topology/a',
        type: MenuItemType.SIMPLE,
      },
      {
        id: 'topology-b',
        label: '子菜单B',
        icon: <Hub />,
        path: '/topology/b',
        type: MenuItemType.SIMPLE,
      },
    ],
  },
];

function Sidebar({
  width = 240,
  collapsed = false,
  onToggleCollapse,
}: SidebarProps) {
  const [openItems, setOpenItems] = useState<string[]>(['快速连接']); // 默认展开快速连接
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  // const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const handleToggle = (itemId: string) => {
    setOpenItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId],
    );
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    // setSelectedItem(null);
  };

  const renderMenuItem = (item: MenuItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const hasSubComponent =
      item.type === MenuItemType.COMPONENT && item.subComponent;
    const hasActions = item.actions && item.actions.length > 0;
    const isExpandable =
      item.type === MenuItemType.DROPDOWN ||
      item.type === MenuItemType.COMPONENT;
    const isOpen = openItems.includes(item.id);
    const isHovered = hoveredItem === item.id;
    const paddingLeft = level * 2 + 1;

    return (
      <React.Fragment key={item.id}>
        <ListItem disablePadding sx={{ position: 'relative' }}>
          <Tooltip
            title={item.tooltip || item.label}
            placement="right"
            disableHoverListener={!collapsed || isExpandable}
            disableFocusListener={!collapsed || isExpandable}
            disableTouchListener={!collapsed || isExpandable}
          >
            <ListItemButton
              onClick={() => {
                if (isExpandable) {
                  // 可展开菜单切换展开/收起状态
                  handleToggle(item.id);
                } else if (item.type === MenuItemType.SIMPLE) {
                  // 普通菜单直接跳转
                  // 导航到指定路径
                  // navigate(item.path);
                }
              }}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={({ relatedTarget }) => {
                // 检查鼠标是否移动到悬停菜单上
                if (
                  !relatedTarget ||
                  !(relatedTarget as HTMLElement)?.closest?.(
                    '[data-hover-menu]',
                  )
                ) {
                  setHoveredItem(null);
                }
              }}
              sx={{
                borderRadius: 1,
                mb: 0.5,
                pl: collapsed ? 0 : paddingLeft,
                pr: collapsed ? 0 : 1,
                minHeight: collapsed ? 48 : 'auto',
                justifyContent: collapsed ? 'center' : 'flex-start',
                display: 'flex',
                alignItems: 'center',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'primary.contrastText',
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: collapsed ? 0 : 40,
                  mr: collapsed ? 0 : 1,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {item.icon}
              </ListItemIcon>
              {!collapsed && (
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '0.875rem',
                    fontWeight: 500,
                  }}
                />
              )}
              {!collapsed && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {hasActions && (
                    <IconButton
                      size="small"
                      onClick={handleMenuClick}
                      sx={{
                        color: 'text.secondary',
                        '&:hover': { backgroundColor: 'action.hover' },
                      }}
                    >
                      <MoreVert fontSize="small" />
                    </IconButton>
                  )}
                  {isExpandable &&
                    (isOpen ? <ArrowDropDown /> : <ArrowDropUp />)}
                </Box>
              )}
              {/* 收起状态下的悬停菜单 */}
              {collapsed && isHovered && isExpandable && (
                <Box
                  data-hover-menu
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  sx={{
                    position: 'absolute',
                    left: '100%',
                    top: 0,
                    ml: 0,
                    zIndex: 1300,
                    backgroundColor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    boxShadow: 3,
                    minWidth: 200,
                    maxWidth: 300,
                    maxHeight: '400px',
                    overflow: 'auto',
                    '&::-webkit-scrollbar': {
                      width: '4px',
                    },
                    '&::-webkit-scrollbar-track': {
                      background: 'transparent',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      background: 'rgba(0, 0, 0, 0.2)',
                      borderRadius: '2px',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                      background: 'rgba(0, 0, 0, 0.3)',
                    },
                  }}
                >
                  <Box sx={{ p: 1 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      {item.label}
                    </Typography>

                    <Divider sx={{ mb: 1 }} />

                    {/* 子菜单内容 */}
                    {item.type === MenuItemType.DROPDOWN &&
                      hasChildren &&
                      item.children?.map((child) => (
                        <Box
                          key={child.id}
                          sx={{
                            p: 1,
                            mb: 0.5,
                            borderRadius: 1,
                            cursor: 'pointer',
                            '&:hover': {
                              backgroundColor: 'action.hover',
                            },
                          }}
                          onClick={() => {
                            // 导航到子菜单
                            // navigate(child.path);
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                            }}
                          >
                            {child.icon}
                            <Typography variant="body2">
                              {child.label}
                            </Typography>
                          </Box>
                        </Box>
                      ))}

                    {/* 子组件内容 */}
                    {item.type === MenuItemType.COMPONENT &&
                      hasSubComponent &&
                      item.subComponent?.type === 'recent-connections' && (
                        <RecentConnectionsHover
                          connections={item.subComponent.data || []}
                          onConnectionClick={() => {
                            // 处理连接点击
                            // handleConnectionClick(connection);
                          }}
                        />
                      )}

                    {/* 操作按钮 */}
                    {hasActions && (
                      <Box
                        sx={{
                          display: 'flex',
                          gap: 1,
                          mt: 1,
                          pt: 1,
                          borderTop: '1px solid',
                          borderColor: 'divider',
                          justifyContent: 'flex-end',
                        }}
                      >
                        {item.actions?.map((action) => (
                          <Tooltip
                            key={`${item.id}-action-${action.tooltip}`}
                            title={action.tooltip}
                            placement="top"
                          >
                            <IconButton
                              size="small"
                              onClick={action.onClick}
                              sx={{ color: 'text.secondary' }}
                            >
                              {action.icon}
                            </IconButton>
                          </Tooltip>
                        ))}
                      </Box>
                    )}
                  </Box>
                </Box>
              )}
            </ListItemButton>
          </Tooltip>
        </ListItem>
        {isExpandable && !collapsed && (
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {/* 子菜单渲染 */}
              {item.type === MenuItemType.DROPDOWN &&
                hasChildren &&
                item.children?.map((child) => renderMenuItem(child, level + 1))}

              {/* 子组件渲染 */}
              {item.type === MenuItemType.COMPONENT &&
                hasSubComponent &&
                item.subComponent?.type === 'recent-connections' && (
                  <RecentConnections
                    connections={item.subComponent.data || []}
                    onConnectionClick={() => {
                      // 处理连接点击
                      // handleConnectionClick(connection);
                    }}
                    paddingLeft={paddingLeft}
                  />
                )}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: collapsed ? 64 : width,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: collapsed ? 64 : width,
          boxSizing: 'border-box',
          backgroundColor: 'background.paper',
          borderRight: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'visible',
        },
      }}
    >
      {!collapsed && (
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            NetTopologyConnect
          </Typography>
          <Typography variant="caption" color="text.secondary">
            网络拓扑连接工具
          </Typography>
        </Box>
      )}

      <Divider />

      <List
        sx={{
          px: 1,
          flex: 1,
          overflow: 'auto',
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: 'rgba(255, 255, 255, 0.3)',
          },
        }}
      >
        {menuItems.map((item) => renderMenuItem(item))}
      </List>

      {/* 收起/展开按钮 */}
      <Box
        sx={{
          p: 1,
          borderTop: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          justifyContent: collapsed ? 'center' : 'flex-end',
        }}
      >
        <IconButton
          onClick={onToggleCollapse}
          sx={{
            color: 'text.secondary',
            '&:hover': { backgroundColor: 'action.hover' },
          }}
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </IconButton>
      </Box>

      {/* 操作菜单 */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {menuItems
          .find((item) => item.actions && item.actions.length > 0)
          ?.actions?.map((action) => (
            <MuiMenuItem
              key={`menu-${action.tooltip}`}
              onClick={() => {
                action.onClick();
                handleMenuClose();
              }}
            >
              <ListItemIcon>{action.icon}</ListItemIcon>
              <ListItemText
                primary={action.tooltip}
                primaryTypographyProps={{
                  fontSize: '0.875rem',
                  fontWeight: 500,
                }}
              />
            </MuiMenuItem>
          ))}
      </Menu>
    </Drawer>
  );
}

Sidebar.defaultProps = {
  collapsed: false,
  onToggleCollapse: undefined,
};

export default Sidebar;
