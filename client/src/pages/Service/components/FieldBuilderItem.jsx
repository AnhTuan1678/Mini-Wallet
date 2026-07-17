import { memo } from 'react';

import {
  Box,
  Checkbox,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';

import {
  DATA_TYPES,
  FIELD_BUILDER_RULES,
  QUERY_OPTIONS,
  getAvailableFields,
} from '../../../constants/fieldBuilder';
import useService from '../../../contexts/useService';

const FieldBuilderItem = ({ field, index, onChange, onRemove }) => {
  const { transField } = useService();
  const updateField = (key, value) => {
    onChange(index, {
      ...field,
      [key]: value,
    });
  };

  const handleQueryChange = (value) => {
    const query = QUERY_OPTIONS.find((item) => item.value === value);

    if (!query) return;

    onChange(index, {
      ...field,
      query: query.value,
      queryFields: query.inputs,
      columns: query.outputs,
    });
  };

  const outputs =
    QUERY_OPTIONS.find((q) => q.value === field.query)?.outputs ?? [];
  const availableFields = getAvailableFields(transField || []);

  return (
    <Stack direction='row' sx={{ alignItems: 'center' }}>
      <Box
        sx={{
          flex: 1,
          mb: 2,
          p: 2,
          border: '1px solid #ddd',
          borderRadius: 1,
        }}
      >
        <Grid container spacing={0.5}>
          {/* Order */}
          <Grid size={{ xs: 12, md: 1 }}>
            <TextField
              fullWidth
              size='small'
              label='Order'
              type='number'
              value={field.order ?? ''}
              onChange={(e) => updateField('order', Number(e.target.value))}
            />
          </Grid>

          {/* Code */}
          <Grid size={{ xs: 12, md: 2 }}>
            <TextField
              fullWidth
              size='small'
              label='Code'
              value={field.code ?? ''}
              onChange={(e) => updateField('code', e.target.value)}
            />
          </Grid>

          {/* Name */}
          <Grid size={{ xs: 12, md: 2 }}>
            <TextField
              fullWidth
              size='small'
              label='Name'
              value={field.name ?? ''}
              onChange={(e) => updateField('name', e.target.value)}
            />
          </Grid>

          {/* Data Type */}
          <Grid size={{ xs: 12, md: 2 }}>
            <FormControl fullWidth size='small'>
              <InputLabel>Data Type</InputLabel>

              <Select
                value={field.dataType ?? ''}
                label='Data Type'
                onChange={(e) => updateField('dataType', e.target.value)}
              >
                {DATA_TYPES.map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Rule */}
          <Grid size={{ xs: 12, md: 2 }}>
            <FormControl fullWidth size='small'>
              <InputLabel>Rule</InputLabel>

              <Select
                value={field.rule ?? ''}
                label='Rule'
                onChange={(e) => updateField('rule', e.target.value)}
              >
                {FIELD_BUILDER_RULES.map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Fixed */}
          {field.rule === 'fixed' && (
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                size='small'
                label='Value'
                value={field.value ?? ''}
                onChange={(e) => updateField('value', e.target.value)}
              />
            </Grid>
          )}

          {/* Mapping */}
          {field.rule === 'mapping' && (
            <Grid size={{ xs: 12, md: 3 }}>
              <FormControl fullWidth size='small'>
                <InputLabel>Source Field</InputLabel>

                <Select
                  value={field.sourceField ?? ''}
                  label='Source Field'
                  onChange={(e) => updateField('sourceField', e.target.value)}
                >
                  {availableFields.map((f) => (
                    <MenuItem key={f.code} value={f.code}>
                      {f.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}

          {/* Query */}
          {field.rule === 'query' && (
            <>
              <Grid size={{ xs: 12, md: 3 }}>
                <FormControl fullWidth size='small'>
                  <InputLabel>Query</InputLabel>

                  <Select
                    value={field.query ?? ''}
                    label='Query'
                    onChange={(e) => handleQueryChange(e.target.value)}
                  >
                    {QUERY_OPTIONS.map((q) => (
                      <MenuItem key={q.value} value={q.value}>
                        {q.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Input Fields */}
              <Grid size={{ xs: 12, md: 3 }}>
                <FormControl fullWidth size='small'>
                  <InputLabel>Input Fields</InputLabel>

                  <Select
                    multiple
                    value={field.queryFields ?? []}
                    renderValue={(selected) => selected.join(', ')}
                    onChange={(e) => updateField('queryFields', e.target.value)}
                  >
                    {availableFields.map((f) => (
                      <MenuItem key={f.code} value={f.code}>
                        <Checkbox
                          checked={(field.queryFields ?? []).includes(f.code)}
                        />

                        <ListItemText primary={f.name} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Columns */}
              <Grid size={{ xs: 12, md: 3 }}>
                <FormControl fullWidth size='small'>
                  <InputLabel>Columns</InputLabel>

                  <Select
                    multiple
                    value={field.columns ?? []}
                    renderValue={(selected) => selected.join(', ')}
                    onChange={(e) => updateField('columns', e.target.value)}
                  >
                    {outputs.map((column) => (
                      <MenuItem key={column} value={column}>
                        <Checkbox
                          checked={(field.columns ?? []).includes(column)}
                        />

                        <ListItemText primary={column} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </>
          )}
        </Grid>
      </Box>

      {/* Delete */}
      <IconButton color='error' onClick={() => onRemove(index)}>
        <DeleteIcon />
      </IconButton>
    </Stack>
  );
};

export default memo(FieldBuilderItem);
