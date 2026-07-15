import { Box, Toolbar } from '@mui/material';
import { Navigate, Outlet } from 'react-router-dom';

import Sidebar from './Sidebar';
import useAuth from '../contexts/useAuth';

export default function DefaultLayout() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to='/login' replace />;
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Sidebar />

      <Box
        component='main'
        sx={{
          flexGrow: 1,
          p: 3,
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
