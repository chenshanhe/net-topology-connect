/* eslint-disable react/require-default-props */
import React from 'react';
import {
  Box,
  Typography,
  Chip,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';

export interface RecentConnection {
  id: string;
  name: string;
  host: string;
  port: number;
  type: string;
}

interface RecentConnectionsProps {
  connections: RecentConnection[];
  onConnectionClick?: (connection: RecentConnection) => void;
  paddingLeft?: number;
  showEmptyMessage?: boolean;
  emptyMessage?: string;
}

// 展开状态下的最近连接组件
// eslint-disable-next-line react/require-default-props
function RecentConnections({
  connections,
  onConnectionClick,
  paddingLeft = 0,
  showEmptyMessage = true,
  emptyMessage = '最近没有快速连接',
}: RecentConnectionsProps) {
  if (!connections || connections.length === 0) {
    if (!showEmptyMessage) return null;

    return (
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
          {emptyMessage}
        </Typography>
      </Box>
    );
  }

  return (
    <>
      {connections.map((connection) => (
        <ListItem key={connection.id} disablePadding>
          <ListItemButton
            sx={{
              pl: paddingLeft + 2,
              py: 0.5,
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
            onClick={() => onConnectionClick?.(connection)}
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
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {connection.name}
                  </Typography>
                  <Chip
                    label={connection.type}
                    size="small"
                    sx={{
                      height: '18px',
                      fontSize: '0.7rem',
                      backgroundColor: '#4caf50',
                      color: 'white',
                      '& .MuiChip-label': {
                        px: 1,
                        py: 0.2,
                      },
                    }}
                  />
                </Box>
              }
              secondary={`${connection.host}:${connection.port}`}
              secondaryTypographyProps={{
                fontSize: '0.75rem',
              }}
            />
          </ListItemButton>
        </ListItem>
      ))}
    </>
  );
}

interface RecentConnectionsHoverProps {
  connections: RecentConnection[];
  onConnectionClick?: (connection: RecentConnection) => void;
  emptyMessage?: string;
}

// 悬停菜单中的最近连接组件
// eslint-disable-next-line react/require-default-props
function RecentConnectionsHover({
  connections,
  onConnectionClick,
  emptyMessage = '最近没有快速连接',
}: RecentConnectionsHoverProps) {
  if (!connections || connections.length === 0) {
    return (
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
          {emptyMessage}
        </Typography>
      </Box>
    );
  }

  return (
    <>
      {connections.map((connection) => (
        <Box
          key={connection.id}
          sx={{
            p: 1,
            mb: 0.5,
            borderRadius: 1,
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
          onClick={() => onConnectionClick?.(connection)}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              mb: 0.5,
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {connection.name}
            </Typography>
            <Chip
              label={connection.type}
              size="small"
              sx={{
                height: '18px',
                fontSize: '0.7rem',
                backgroundColor: '#4caf50',
                color: 'white',
                '& .MuiChip-label': {
                  px: 1.5,
                  py: 0.2,
                },
              }}
            />
          </Box>
          <Typography variant="caption" color="text.secondary">
            {connection.host}:{connection.port}
          </Typography>
        </Box>
      ))}
    </>
  );
}

export default RecentConnections;
export { RecentConnectionsHover };
