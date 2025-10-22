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
  Chip,
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

interface SidebarProps {
  width: number;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  children?: MenuItem[];
  isQuickConnect?: boolean;
  recentConnections?: Array<{
    id: string;
    name: string;
    host: string;
    port: number;
    type: string;
  }>;
}

const menuItems: MenuItem[] = [
  {
    id: 'home',
    label: '首页',
    icon: <Home />,
    path: '/',
  },
  {
    id: '拓扑',
    label: '拓扑',
    icon: <Hub />,
    path: '/topology',
  },
  {
    id: '快速连接',
    label: '快速连接',
    icon: <OfflineBolt />,
    path: '/quick-connect',
    isQuickConnect: true,
    recentConnections: [], // 默认没有最近连接
  },
  {
    id: 'settings',
    label: '设置',
    icon: <Settings />,
    path: '/settings',
  },
  {
    id: 'help',
    label: '帮助',
    icon: <Help />,
    path: '/help',
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

  const handleClearRecent = () => {
    // 清空最近连接记录的逻辑
    // console.log('清空最近连接记录');
    handleMenuClose();
  };

  const handleOpenConnectionList = () => {
    // 打开连接列表的逻辑
    // console.log('打开连接列表');
    handleMenuClose();
  };

  const renderMenuItem = (item: MenuItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const hasRecentConnections =
      item.isQuickConnect &&
      item.recentConnections &&
      item.recentConnections.length > 0;
    const isQuickConnectMenu = item.isQuickConnect; // 快速连接菜单始终可以展开
    const isOpen = openItems.includes(item.id);
    const isHovered = hoveredItem === item.id;
    const paddingLeft = level * 2 + 1;

    return (
      <React.Fragment key={item.id}>
        <ListItem disablePadding sx={{ position: 'relative' }}>
          <Tooltip
            title={item.label}
            placement="right"
            disableHoverListener={!collapsed || item.isQuickConnect}
            disableFocusListener={!collapsed || item.isQuickConnect}
            disableTouchListener={!collapsed || item.isQuickConnect}
          >
            <ListItemButton
              onClick={() => {
                if (item.isQuickConnect) {
                  // 快速连接切换展开/收起状态
                  handleToggle(item.id);
                } else if (hasChildren) {
                  handleToggle(item.id);
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
                  {(hasChildren || isQuickConnectMenu) &&
                    (isOpen ? <ArrowDropDown /> : <ArrowDropUp />)}
                  {item.isQuickConnect && (
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
                </Box>
              )}
              {/* 收起状态下的悬停菜单 */}
              {collapsed && isHovered && item.isQuickConnect && (
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
                  }}
                >
                  <Box sx={{ p: 1 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      {item.label}
                    </Typography>

                    <Divider sx={{ mb: 1 }} />

                    {/* 最近连接列表 */}
                    {hasRecentConnections &&
                      item.recentConnections?.map((connection) => (
                        <Box
                          key={connection.id}
                          sx={{
                            p: 1,
                            mb: 0.5,
                            borderRadius: 1,
                            '&:hover': {
                              backgroundColor: 'action.hover',
                            },
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                              mb: 0.5,
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 500 }}
                            >
                              {connection.name}
                            </Typography>
                            <Chip
                              label={connection.type}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            {connection.host}:{connection.port}
                          </Typography>
                        </Box>
                      ))}

                    {/* 没有最近连接时的提示 */}
                    {item.isQuickConnect &&
                      (!item.recentConnections ||
                        item.recentConnections.length === 0) && (
                        <Box
                          sx={{
                            p: 2,
                            textAlign: 'center',
                          }}
                        >
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontStyle: 'italic' }}
                          >
                            最近没有快速连接
                          </Typography>
                        </Box>
                      )}

                    {/* 操作按钮 */}
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
                      <Tooltip title="清空记录" placement="top">
                        <IconButton
                          size="small"
                          onClick={handleClearRecent}
                          sx={{ color: 'text.secondary' }}
                        >
                          <Clear fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="查看完整记录" placement="top">
                        <IconButton
                          size="small"
                          onClick={handleOpenConnectionList}
                          sx={{ color: 'text.secondary' }}
                        >
                          <ListIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </Box>
              )}
            </ListItemButton>
          </Tooltip>
        </ListItem>
        {(hasChildren || isQuickConnectMenu) && !collapsed && (
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {hasRecentConnections &&
                item.recentConnections?.map((connection) => (
                  <ListItem key={connection.id} disablePadding>
                    <ListItemButton
                      sx={{
                        pl: paddingLeft + 2,
                        py: 0.5,
                        '&:hover': {
                          backgroundColor: 'action.hover',
                        },
                      }}
                    >
                      <ListItemText
                        primary={
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 500 }}
                            >
                              {connection.name}
                            </Typography>
                            <Chip
                              label={connection.type}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          </Box>
                        }
                        secondary={`${connection.host}:${connection.port}`}
                        secondaryTypographyProps={{ fontSize: '0.75rem' }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              {item.isQuickConnect &&
                (!item.recentConnections ||
                  item.recentConnections.length === 0) && (
                  <ListItem disablePadding>
                    <Box
                      sx={{
                        pl: paddingLeft + 2,
                        py: 2,
                        px: 2,
                        width: '100%',
                        textAlign: 'center',
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontStyle: 'italic' }}
                      >
                        最近没有快速连接
                      </Typography>
                    </Box>
                  </ListItem>
                )}
              {hasChildren &&
                item.children?.map((child) => renderMenuItem(child, level + 1))}
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

      <List sx={{ px: 1, flex: 1, overflow: 'visible' }}>
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

      {/* 快速连接菜单 */}
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
        <MuiMenuItem onClick={handleClearRecent}>
          <ListItemIcon>
            <Clear fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="清空记录"
            primaryTypographyProps={{
              fontSize: '0.875rem',
              fontWeight: 500,
            }}
          />
        </MuiMenuItem>
        <MuiMenuItem onClick={handleOpenConnectionList}>
          <ListItemIcon>
            <ListIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="查看完整记录"
            primaryTypographyProps={{
              fontSize: '0.875rem',
              fontWeight: 500,
            }}
          />
        </MuiMenuItem>
      </Menu>
    </Drawer>
  );
}

Sidebar.defaultProps = {
  collapsed: false,
  onToggleCollapse: undefined,
};

export default Sidebar;
