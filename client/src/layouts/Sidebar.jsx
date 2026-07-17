import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import {
  AccountCircle,
  DashboardRounded,
  History,
  LogoutRounded,
  SendRounded,
  ReceiptLongRounded,
  Wallet,
  AddCircle,
  AccountBalanceWallet,
  Settings,
} from '@mui/icons-material';
import { NavLink } from 'react-router-dom';

import useAuth from '../contexts/useAuth';

const drawerWidth = 240;

const menuCustomerItems = [
  {
    text: 'Chuyển tiền',
    icon: <SendRounded />,
    path: '/transfer',
  },
  {
    text: 'Thanh toán hóa đơn',
    icon: <ReceiptLongRounded />,
    path: '/bill-payment',
  },
  {
    text: 'Ví',
    icon: <Wallet />,
    path: '/wallet',
  },
  {
    text: 'Lịch sử giao dịch',
    icon: <History />,
    path: '/transactions-history',
  },
];

const menuAdminItems = [
  {
    text: 'Dashboard',
    icon: <DashboardRounded />,
    path: '/',
  },
  {
    text: 'Ví',
    icon: <Wallet />,
    path: '/admin/wallet',
  },
  {
    text: 'Services',
    icon: <Settings />,
    path: '/admin/services',
  },
  {
    text: 'Biller',
    icon: <ReceiptLongRounded />,
    path: '/admin/billers',
  },
  {
    text: 'Hóa đơn',
    icon: <ReceiptLongRounded />,
    path: '/admin/bills',
  },
  {
    text: 'Lịch sử giao dịch',
    icon: <History />,
    path: '/admin/transactions-history',
  },
  {
    text: 'Người dùng',
    icon: <AccountCircle />,
    path: '/admin/users',
  },
  {
    text: 'Nạp tiền',
    icon: <AccountBalanceWallet />,
    path: '/admin/cash-in',
  },
  {
    text: 'Tạo dịch vụ',
    icon: <AddCircle />,
    path: '/admin/service/create',
  },
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  const role = user?.role;

  return (
    <Drawer
      variant='permanent'
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Box sx={{ py: 3, textAlign: 'center' }}>
        <Typography variant='h5' fontWeight={700} color='primary'>
          Mini Wallet
        </Typography>

        <Typography variant='body2' color='text.secondary'>
          Digital Wallet
        </Typography>
      </Box>

      <Divider />

      <List sx={{ px: 1, pt: 1 }}>
        {(role === 'admin' ? menuAdminItems : menuCustomerItems).map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={NavLink}
              to={item.path}
              end={item.path === '/'}
              className='sidebar-link'
            >
              <ListItemIcon>{item.icon}</ListItemIcon>

              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Box sx={{ flexGrow: 1 }} />

      <Divider />

      <Box sx={{ p: 2 }}>
        <Stack direction='row' spacing={2} sx={{ mb: 2 }}>
          <AccountCircle sx={{ fontSize: 40, color: 'text.secondary' }} />
          <Box sx={{ flex: 1 }}>
            <Typography fontWeight={600} noWrap>
              {(user?.name || user?.phone || user?.email) ?? 'Người dùng'}
            </Typography>

            <Typography variant='body2' color='text.secondary' noWrap>
              {user?.role || 'Guest'}
            </Typography>
          </Box>
        </Stack>

        <ListItemButton
          onClick={logout}
          sx={{
            borderRadius: 2,
            color: 'error.main',

            '&:hover': {
              bgcolor: 'error.lighter',
            },
          }}
        >
          <ListItemIcon
            sx={{
              color: 'error.main',
              minWidth: 40,
            }}
          >
            <LogoutRounded />
          </ListItemIcon>

          <ListItemText primary='Đăng xuất' />
        </ListItemButton>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
