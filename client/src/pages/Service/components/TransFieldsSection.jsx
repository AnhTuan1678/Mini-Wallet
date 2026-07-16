import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const TransFieldsSection = ({
  transFields,
  handleTransFieldChange,
  addTransField,
  removeTransField,
}) => {
  return (
    <Grid sx={{ width: '100%' }} size={12}>
      <Card>
        <CardContent>
          <Stack
            direction='row'
            sx={{
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography variant='h6' fontWeight={600}>
              Trường giao dịch (TransFields)
            </Typography>
          </Stack>
          {transFields.map((field, index) => (
            <Stack
              direction='row'
              key={index}
              spacing={0}
              sx={{ alignItems: 'center' }}
            >
              <Box
                sx={{
                  mb: 2,
                  p: 2,
                  border: '1px solid #e0e0e0',
                  borderRadius: 1,
                }}
              >
                <Grid container spacing={2} alignItems='center'>
                  <Grid
                    size={{
                      xs: 12,
                      md: 2,
                    }}
                  >
                    <TextField
                      fullWidth
                      label='Thứ tự'
                      type='number'
                      value={field.order}
                      onChange={(e) =>
                        handleTransFieldChange(
                          index,
                          'order',
                          Number(e.target.value)
                        )
                      }
                      size='small'
                    />
                  </Grid>
                  <Grid
                    size={{
                      xs: 12,
                      md: 3,
                    }}
                  >
                    <TextField
                      fullWidth
                      label='Tên trường'
                      value={field.fieldName}
                      onChange={(e) =>
                        handleTransFieldChange(
                          index,
                          'fieldName',
                          e.target.value
                        )
                      }
                      size='small'
                    />
                  </Grid>
                  <Grid
                    size={{
                      xs: 12,
                      md: 2,
                    }}
                  >
                    <FormControl fullWidth size='small'>
                      <InputLabel>Kiểu dữ liệu</InputLabel>
                      <Select
                        value={field.dataType}
                        onChange={(e) =>
                          handleTransFieldChange(
                            index,
                            'dataType',
                            e.target.value
                          )
                        }
                        label='Kiểu dữ liệu'
                      >
                        <MenuItem value='string'>String</MenuItem>
                        <MenuItem value='number'>Number</MenuItem>
                        <MenuItem value='boolean'>Boolean</MenuItem>
                        <MenuItem value='date'>Date</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid
                    size={{
                      xs: 12,
                      md: 2,
                    }}
                  >
                    <FormControl fullWidth size='small'>
                      <InputLabel>Bắt buộc</InputLabel>
                      <Select
                        value={field.isRequired}
                        onChange={(e) =>
                          handleTransFieldChange(
                            index,
                            'isRequired',
                            e.target.value
                          )
                        }
                        label='Bắt buộc'
                      >
                        <MenuItem value={true}>Có</MenuItem>
                        <MenuItem value={false}>Không</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid
                    size={{
                      xs: 12,
                      md: 3,
                    }}
                  >
                    <TextField
                      fullWidth
                      label='Độ dài tối thiểu'
                      type='number'
                      value={field.minLength}
                      onChange={(e) =>
                        handleTransFieldChange(
                          index,
                          'minLength',
                          e.target.value ? Number(e.target.value) : ''
                        )
                      }
                      size='small'
                    />
                  </Grid>
                  <Grid
                    size={{
                      xs: 12,
                      md: 3,
                    }}
                  >
                    <TextField
                      fullWidth
                      label='Độ dài tối đa'
                      type='number'
                      value={field.maxLength}
                      onChange={(e) =>
                        handleTransFieldChange(
                          index,
                          'maxLength',
                          e.target.value ? Number(e.target.value) : ''
                        )
                      }
                      size='small'
                    />
                  </Grid>
                  <Grid
                    size={{
                      xs: 12,
                      md: 4,
                    }}
                  >
                    <TextField
                      fullWidth
                      label='Regex pattern'
                      value={field.regex}
                      onChange={(e) =>
                        handleTransFieldChange(index, 'regex', e.target.value)
                      }
                      size='small'
                    />
                  </Grid>
                  <Grid
                    size={{
                      xs: 12,
                      md: 2,
                    }}
                  >
                    <TextField
                      fullWidth
                      label='Mã lỗi'
                      value={field.errorCode}
                      onChange={(e) =>
                        handleTransFieldChange(
                          index,
                          'errorCode',
                          e.target.value
                        )
                      }
                      size='small'
                    />
                  </Grid>{' '}
                </Grid>
              </Box>
              <Grid
                size={{
                  xs: 12,
                  md: 1,
                }}
              >
                <IconButton
                  onClick={() => removeTransField(index)}
                  color='error'
                >
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Stack>
          ))}
          <Button
            startIcon={<AddIcon />}
            onClick={addTransField}
            variant='outlined'
          >
            Thêm TransField
          </Button>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default TransFieldsSection;
