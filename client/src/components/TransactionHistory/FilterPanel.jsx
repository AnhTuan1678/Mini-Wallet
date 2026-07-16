import {
  Card,
  CardContent,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Typography,
} from '@mui/material';

const FilterPanel = ({
  filters,
  setFilters,
  sortField,
  setSortField,
  sortOrder,
  setSortOrder,
  resetFilters,
}) => {
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant='h6' fontWeight={600} sx={{ mb: 2 }}>
          Bộ lọc & Sắp xếp
        </Typography>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl fullWidth size='small'>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                label='Trạng thái'
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
              >
                <MenuItem value=''>Tất cả</MenuItem>
                <MenuItem value='done'>Thành công</MenuItem>
                <MenuItem value='pending'>Đang xử lý</MenuItem>
                <MenuItem value='failed'>Thất bại</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              fullWidth
              size='small'
              label='Mã giao dịch'
              value={filters.transRefId}
              onChange={(e) =>
                setFilters({ ...filters, transRefId: e.target.value })
              }
              placeholder='Tìm kiếm mã giao dịch'
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <TextField
              fullWidth
              size='small'
              label='Số tiền tối thiểu'
              type='number'
              value={filters.minAmount}
              onChange={(e) =>
                setFilters({ ...filters, minAmount: e.target.value })
              }
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <TextField
              fullWidth
              size='small'
              label='Số tiền tối đa'
              type='number'
              value={filters.maxAmount}
              onChange={(e) =>
                setFilters({ ...filters, maxAmount: e.target.value })
              }
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <FormControl fullWidth size='small'>
              <InputLabel>Sắp xếp theo</InputLabel>
              <Select
                label='Sắp xếp theo'
                value={sortField}
                onChange={(e) => setSortField(e.target.value)}
              >
                <MenuItem value='createdAt'>Ngày tạo</MenuItem>
                <MenuItem value='amount'>Số tiền</MenuItem>
                <MenuItem value='totalAmount'>Tổng số tiền</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <FormControl fullWidth size='small'>
              <InputLabel>Thứ tự</InputLabel>
              <Select
                label='Thứ tự'
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <MenuItem value='DESC'>Giảm dần</MenuItem>
                <MenuItem value='ASC'>Tăng dần</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              fullWidth
              size='small'
              label='Từ ngày'
              type='date'
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              value={filters.startDate}
              onChange={(e) =>
                setFilters({ ...filters, startDate: e.target.value })
              }
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              fullWidth
              size='small'
              label='Đến ngày'
              type='date'
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              value={filters.endDate}
              onChange={(e) =>
                setFilters({ ...filters, endDate: e.target.value })
              }
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Button fullWidth variant='outlined' onClick={resetFilters}>
              Đặt lại
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default FilterPanel;
