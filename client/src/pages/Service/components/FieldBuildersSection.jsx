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

const FieldBuildersSection = ({
  fieldBuilders,
  handleFieldBuilderChange,
  addFieldBuilder,
  removeFieldBuilder,
}) => {
  return (
    <Grid item xs={12}>
      <Card>
        <CardContent>
          <Stack
            direction='row'
            justifyContent='space-between'
            alignItems='center'
            mb={2}
          >
            <Typography variant='h6' fontWeight={600}>
              Field Builders
            </Typography>
            <Button
              startIcon={<AddIcon />}
              onClick={addFieldBuilder}
              variant='outlined'
            >
              Thêm FieldBuilder
            </Button>
          </Stack>
          {fieldBuilders.map((builder, index) => (
            <Box
              key={index}
              sx={{
                mb: 2,
                p: 2,
                border: '1px solid #e0e0e0',
                borderRadius: 1,
              }}
            >
              <Grid container spacing={2} alignItems='center'>
                <Grid item xs={12} md={1}>
                  <TextField
                    fullWidth
                    label='Thứ tự'
                    type='number'
                    value={builder.order}
                    onChange={(e) =>
                      handleFieldBuilderChange(
                        index,
                        'order',
                        Number(e.target.value)
                      )
                    }
                    size='small'
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <TextField
                    fullWidth
                    label='Mã'
                    value={builder.code}
                    onChange={(e) =>
                      handleFieldBuilderChange(index, 'code', e.target.value)
                    }
                    size='small'
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <TextField
                    fullWidth
                    label='Tên'
                    value={builder.name}
                    onChange={(e) =>
                      handleFieldBuilderChange(index, 'name', e.target.value)
                    }
                    size='small'
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <FormControl fullWidth size='small'>
                    <InputLabel>Kiểu dữ liệu</InputLabel>
                    <Select
                      value={builder.dataType}
                      onChange={(e) =>
                        handleFieldBuilderChange(index, 'dataType', e.target.value)
                      }
                      label='Kiểu dữ liệu'
                    >
                      <MenuItem value='string'>String</MenuItem>
                      <MenuItem value='number'>Number</MenuItem>
                      <MenuItem value='boolean'>Boolean</MenuItem>
                      <MenuItem value='date'>Date</MenuItem>
                      <MenuItem value='object'>Object</MenuItem>
                      <MenuItem value='array'>Array</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={2}>
                  <FormControl fullWidth size='small'>
                    <InputLabel>Quy tắc</InputLabel>
                    <Select
                      value={builder.rule}
                      onChange={(e) =>
                        handleFieldBuilderChange(index, 'rule', e.target.value)
                      }
                      label='Quy tắc'
                    >
                      <MenuItem value='fixed'>Fixed</MenuItem>
                      <MenuItem value='mapping'>Mapping</MenuItem>
                      <MenuItem value='query'>Query</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={2}>
                  <FormControl fullWidth size='small'>
                    <InputLabel>Bắt buộc</InputLabel>
                    <Select
                      value={builder.isRequired}
                      onChange={(e) =>
                        handleFieldBuilderChange(index, 'isRequired', e.target.value)
                      }
                      label='Bắt buộc'
                    >
                      <MenuItem value={true}>Có</MenuItem>
                      <MenuItem value={false}>Không</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={1}>
                  <IconButton
                    onClick={() => removeFieldBuilder(index)}
                    color='error'
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
              {/* Conditional fields based on rule */}
              {builder.rule === 'fixed' && (
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label='Giá trị cố định (JSON)'
                      value={builder.value}
                      onChange={(e) =>
                        handleFieldBuilderChange(index, 'value', e.target.value)
                      }
                      size='small'
                      placeholder='{"key": "value"}'
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label='Thông báo lỗi'
                      value={builder.error}
                      onChange={(e) =>
                        handleFieldBuilderChange(index, 'error', e.target.value)
                      }
                      size='small'
                    />
                  </Grid>
                </Grid>
              )}
              {builder.rule === 'mapping' && (
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth size='small'>
                      <InputLabel>Nguồn dữ liệu</InputLabel>
                      <Select
                        value={builder.source}
                        onChange={(e) =>
                          handleFieldBuilderChange(index, 'source', e.target.value)
                        }
                        label='Nguồn dữ liệu'
                      >
                        <MenuItem value='body'>Body</MenuItem>
                        <MenuItem value='user'>User</MenuItem>
                        <MenuItem value='pocket'>Pocket</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label='Trường nguồn'
                      value={builder.sourceField}
                      onChange={(e) =>
                        handleFieldBuilderChange(
                          index,
                          'sourceField',
                          e.target.value
                        )
                      }
                      size='small'
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label='Thông báo lỗi'
                      value={builder.error}
                      onChange={(e) =>
                        handleFieldBuilderChange(index, 'error', e.target.value)
                      }
                      size='small'
                    />
                  </Grid>
                </Grid>
              )}
              {builder.rule === 'query' && (
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12} md={12}>
                    <TextField
                      fullWidth
                      label='Query SQL'
                      value={builder.query}
                      onChange={(e) =>
                        handleFieldBuilderChange(index, 'query', e.target.value)
                      }
                      size='small'
                      multiline
                      rows={2}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label='Query Fields (JSON array)'
                      value={builder.queryFields}
                      onChange={(e) =>
                        handleFieldBuilderChange(
                          index,
                          'queryFields',
                          e.target.value
                        )
                      }
                      size='small'
                      placeholder='["field1", "field2"]'
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label='Columns (JSON array)'
                      value={builder.columns}
                      onChange={(e) =>
                        handleFieldBuilderChange(index, 'columns', e.target.value)
                      }
                      size='small'
                      placeholder='["col1", "col2"]'
                    />
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <TextField
                      fullWidth
                      label='Thông báo lỗi'
                      value={builder.error}
                      onChange={(e) =>
                        handleFieldBuilderChange(index, 'error', e.target.value)
                      }
                      size='small'
                    />
                  </Grid>
                </Grid>
              )}
            </Box>
          ))}
        </CardContent>
      </Card>
    </Grid>
  );
};

export default FieldBuildersSection;
