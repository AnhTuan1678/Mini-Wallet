import { Button, Card, CardContent, Grid, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import useService from '../../../contexts/useService';
import TransFieldItem from './TransFieldItem';

const TransFieldsSection = () => {
  const { transField, setTransField, addTransField, removeTransField } =
    useService();

  const updateItem = (index, value) => {
    setTransField((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  return (
    <Grid size={12} sx={{ width: '100%' }}>
      <Card>
        <CardContent>
          <Typography variant='h6' sx={{ mb: 2, fontWeight: 600 }}>
            Trans Fields (Các trường dữ liệu đầu vào của service)
          </Typography>

          {transField.map((field, index) => (
            <TransFieldItem
              key={field.id ?? index}
              field={field}
              index={index}
              onChange={updateItem}
              onRemove={removeTransField}
            />
          ))}

          {/* Lưu ý */}
          <Typography variant='subtitle2' sx={{ mt: 2, mb: 1 }}>
            Độ dài tối đa nếu là 0 thì không giới hạn.
          </Typography>

          <Button
            startIcon={<AddIcon />}
            variant='outlined'
            onClick={addTransField}
          >
            Thêm TransField
          </Button>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default TransFieldsSection;
