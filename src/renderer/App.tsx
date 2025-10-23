import { MemoryRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
  CssBaseline,
  Button,
  Typography,
  Box,
  Stack,
  IconButton,
} from '@mui/material';
import {
  Wifi,
  Close,
  Remove,
  Fullscreen,
  FullscreenExit,
} from '@mui/icons-material';
import { useState } from 'react';
import icon from '../../assets/icon.svg';
import Connect from './pages/Connect';
import Sidebar from './components/Sidebar';
import './App.css';

// 创建深色主题（备用主题，可根据需要切换使用）
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// 创建浅色主题（备用主题，可根据需要切换使用）
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
});

const theme = darkTheme;

function MainPage() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        backgroundColor: 'transparent',
        minHeight: '100vh',
        py: 4,
        px: 2,
        maxWidth: 'md',
        mx: 'auto',
      }}
    >
      <img width="200" alt="icon" src={icon} />
      <Typography
        variant="h4"
        component="h2"
        gutterBottom
        sx={{ mt: 2, color: 'white', fontWeight: 'bold' }}
      >
        NetTopologyConnect
      </Typography>
      <Typography
        variant="h5"
        color="text.secondary"
        sx={{ mb: 4, color: 'white' }}
      >
        网络拓扑连接工具
      </Typography>

      <Stack direction="row" spacing={2}>
        <Button
          variant="outlined"
          startIcon={
            <span role="img" aria-label="books">
              📚
            </span>
          }
          href="https://electron-react-boilerplate.js.org/"
          target="_blank"
          rel="noreferrer"
        >
          Read our docs
        </Button>
        <Button
          component={Link}
          to="/connect"
          variant="contained"
          startIcon={<Wifi />}
          size="large"
        >
          Connect
        </Button>
      </Stack>
    </Box>
  );
}

function AppContent() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleMinimize = () => {
    if (window.electron?.ipcRenderer) {
      window.electron.ipcRenderer.sendMessage('window:minimize');
    }
  };

  const handleMaximize = () => {
    if (window.electron?.ipcRenderer) {
      window.electron.ipcRenderer.sendMessage('window:maximize');
      setIsMaximized(!isMaximized);
    }
  };

  const handleClose = () => {
    if (window.electron?.ipcRenderer) {
      window.electron.ipcRenderer.sendMessage('window:close');
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', position: 'relative' }}>
      {/* 自定义窗口控制按钮 - 仅在非 macOS 平台显示 */}
      {window.electron?.platform !== 'darwin' && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            right: 0,
            zIndex: 9999,
            display: 'flex',
            backgroundColor: 'transparent',
          }}
        >
          {/* <IconButton
            size="small"
            sx={{
              color: 'text.primary',
              backgroundColor: 'transparent',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 0,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 0,
              },
            }}
          >
            <MoreVert fontSize="small" />
          </IconButton> */}
          <IconButton
            onClick={handleMinimize}
            size="small"
            sx={{
              color: 'text.primary',
              backgroundColor: 'transparent',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 0,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 0,
              },
            }}
          >
            <Remove fontSize="small" />
          </IconButton>
          <IconButton
            onClick={handleMaximize}
            size="small"
            sx={{
              color: 'text.primary',
              backgroundColor: 'transparent',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 0,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 0,
              },
            }}
          >
            {isMaximized ? (
              <FullscreenExit fontSize="small" />
            ) : (
              <Fullscreen fontSize="small" />
            )}
          </IconButton>
          <IconButton
            onClick={handleClose}
            size="small"
            sx={{
              color: 'text.primary',
              backgroundColor: 'transparent',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 0,
              '&:hover': {
                backgroundColor: 'rgba(255, 0, 0, 0.2)',
                color: 'error.main',
                borderRadius: 0,
              },
            }}
          >
            <Close fontSize="small" />
          </IconButton>
        </Box>
      )}

      <Sidebar
        width={240}
        collapsed={sidebarCollapsed}
        onToggleCollapse={handleToggleSidebar}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          overflow: 'auto',
          backgroundColor: 'transparent',
        }}
      >
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/connect" element={<Connect />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}
