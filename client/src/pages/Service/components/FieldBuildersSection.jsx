import { Button, Card, CardContent, Typography } from '@mui/material';
import useService from '../../../contexts/useService';
import FieldBuilderItem from './FieldBuilderItem';
import AddIcon from '@mui/icons-material/Add';

const FieldBuildersSection = ({
  fieldBuilders,
  handleFieldBuilderChange,
  addFieldBuilder,
  removeFieldBuilder,
}) => {
  const context = useService();
  const builders = fieldBuilders || context?.fieldBuilder;
  const setBuilders = handleFieldBuilderChange || context?.setFieldBuilder;
  const addBuilder = addFieldBuilder || context?.addFieldBuilder;
  const removeBuilder = removeFieldBuilder || context?.removeFieldBuilder;

  if (!builders || !setBuilders || !addBuilder || !removeBuilder) {
    return null;
  }

  const updateItem = (index, value) => {
    setBuilders((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  return (
    <Card>
      <CardContent>
        <Typography variant='h6' sx={{ mb: 2, fontWeight: 600 }}>
          Field Builders
        </Typography>
        <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
          - Field Builders dùng để xác định các trường sẽ được dựng thành dữ
          liệu
          <br />
          - Với các trường kiểu "mapping", chỉ cần chỉ ra tên trường đầu vào
          phẳng từ request
          <br />- Nếu query từ DB trả về object thì sẽ làm phẳng bằng cách dùng
          prefix = tên object (Ví dụ: <code>
            sender = {'{ id, name }'}
          </code> → <code>senderId</code>, <code>senderName</code>)
          <br />
          - Đối với loại dịch vụ transfer/bill-payment, cần tạo được
          senderPocketId và receiverPocketId
        </Typography>
        {builders.map((field, index) => (
          <FieldBuilderItem
            key={field.id ?? index}
            field={field}
            index={index}
            onChange={updateItem}
            onRemove={removeBuilder}
          />
        ))}

        <Button startIcon={<AddIcon />} variant='outlined' onClick={addBuilder}>
          Thêm Field Builder
        </Button>
      </CardContent>
    </Card>
  );
};

export default FieldBuildersSection;
