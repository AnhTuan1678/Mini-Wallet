import { Button, Card, CardContent, Grid, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import useService from '../../../contexts/useService';
import TransFieldItem from './TransFieldItem';

const TransFieldsSection = ({
  transFields,
  handleTransFieldChange,
  addTransField,
  removeTransField,
}) => {
  const context = useService();
  const fields = transFields || context?.transField;
  const setFields = handleTransFieldChange || context?.setTransField;
  const addField = addTransField || context?.addTransField;
  const removeField = removeTransField || context?.removeTransField;

  if (!fields || !setFields || !addField || !removeField) {
    return null;
  }

  const updateItem = (index, value) => {
    setFields((prev) => {
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
          <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
            - Trans Fields định nghĩa từng trường đầu vào cần validate
            <br />
            - Mỗi TransField là trường trong TRANSBODY, dùng để kiểm tra kiểu,
            bắt buộc, giá trị
            <br />
            - code là tên biến đầu vào, type là loại dữ liệu, required xác định
            bắt buộc
            <br />
            - maxLength = 0 nghĩa không giới hạn độ dài
            <br />- Các TransField này validate định dạng trước khi engine xử lý
            nghiệp vụ.
            <br />- Loại transfer, cash-in, bắt buộc phải có amount,
            receiverPhone
          </Typography>

          {fields.map((field, index) => (
            <TransFieldItem
              key={field.id ?? index}
              field={field}
              index={index}
              onChange={updateItem}
              onRemove={removeField}
            />
          ))}

          <Button startIcon={<AddIcon />} variant='outlined' onClick={addField}>
            Thêm TransField
          </Button>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default TransFieldsSection;
