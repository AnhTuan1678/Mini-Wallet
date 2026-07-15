import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Card,
  Chip,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { getAllUsersAPI, updateUserStatusAPI } from '../../services/userApi';
import useAuth from '../../contexts/useAuth';

const STATUS_CONFIG = {
  ACTIVE: {
    label: 'Hoạt động',
    color: 'success',
  },
  INACTIVE: {
    label: 'Không hoạt động',
    color: 'default',
  },
  SUSPENDED: {
    label: 'Tạm khóa',
    color: 'warning',
  },
  BLOCKED: {
    label: 'Khóa',
    color: 'error',
  },
};

const ROLE_CONFIG = {
  customer: {
    label: 'Khách hàng',
    color: 'info',
  },
  admin: {
    label: 'Quản trị viên',
    color: 'secondary',
  },
  biller: {
    label: 'Nhà cung cấp',
    color: 'primary',
  },
  system: {
    label: 'Hệ thống',
    color: 'default',
  },
  bank: {
    label: 'Ngân hàng',
    color: 'default',
  },
};

const UserManagement = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [users, setUsers] = useState([]);
  const [updatingUserId, setUpdatingUserId] = useState(null);

  const { token } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await getAllUsersAPI(token);
        console.log('Users data:', data);
        setUsers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Fetch users error:', err);
        setError(err.message || 'Không thể tải danh sách người dùng');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  const handleStatusChange = async (userId, newStatus) => {
    try {
      setUpdatingUserId(userId);
      setError('');
      setSuccess('');

      await updateUserStatusAPI(token, userId, newStatus);

      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, status: newStatus } : user
        )
      );

      setSuccess('Cập nhật trạng thái thành công');

      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      setError(err.message || 'Không thể cập nhật trạng thái');

      // Auto-hide error message after 5 seconds
      setTimeout(() => {
        setError('');
      }, 5000);
    } finally {
      setUpdatingUserId(null);
    }
  };

  if (loading) {
    return (
      <Box display='flex' justifyContent='center' py={8}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth='xl'>
      <Typography variant='h4' fontWeight={700} mb={3}>
        Quản lý người dùng
      </Typography>

      {error && (
        <Alert severity='error' sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity='success' sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      <Card>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Số điện thoại</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Tên</TableCell>
              <TableCell>Vai trò</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell align='right'>Thao tác</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align='center'>
                  Không có người dùng nào
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>{user.email || '-'}</TableCell>
                  <TableCell>{user.name || '-'}</TableCell>
                  <TableCell>
                    <Chip
                      size='small'
                      label={ROLE_CONFIG[user.role]?.label ?? user.role}
                      color={ROLE_CONFIG[user.role]?.color ?? 'default'}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      size='small'
                      label={STATUS_CONFIG[user.status]?.label ?? user.status}
                      color={STATUS_CONFIG[user.status]?.color ?? 'default'}
                    />
                  </TableCell>
                  <TableCell align='right'>
                    {updatingUserId === user.id ? (
                      <CircularProgress size={24} />
                    ) : (
                      <FormControl size='small' sx={{ minWidth: 120 }}>
                        <InputLabel>Trạng thái</InputLabel>
                        <Select
                          value={user.status}
                          label='Trạng thái'
                          onChange={(e) =>
                            handleStatusChange(user.id, e.target.value)
                          }
                          disabled={user.role === 'admin'}
                        >
                          <MenuItem value='ACTIVE'>Hoạt động</MenuItem>
                          <MenuItem value='INACTIVE'>Không hoạt động</MenuItem>
                          <MenuItem value='SUSPENDED'>Tạm khóa</MenuItem>
                          <MenuItem value='BLOCKED'>Khóa</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </Container>
  );
};

export default UserManagement;
