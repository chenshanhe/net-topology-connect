import { MemoryRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
  CssBaseline,
  Button,
  Container,
  Typography,
  Box,
  Stack,
} from '@mui/material';
import { Wifi } from '@mui/icons-material';
import { useState } from 'react';
import icon from '../../assets/icon.svg';
import Connect from './pages/Connect';
import Sidebar from './components/Sidebar';
import './App.css';

// 创建 MUI 主题
const theme = createTheme({
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

function MainPage() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <img width="200" alt="icon" src={icon} />
        <Typography variant="h3" component="h1" gutterBottom sx={{ mt: 2 }}>
          NetTopologyConnect
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
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
    </Container>
  );
}

function AppContent() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
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
          backgroundColor: 'background.default',
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
