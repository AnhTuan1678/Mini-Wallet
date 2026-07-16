import { Button, Card, CardContent, Typography } from '@mui/material';
import useService from '../../../contexts/useService';
import FieldBuilderItem from './FieldBuilderItem';
import AddIcon from '@mui/icons-material/Add';

const FieldBuildersSection = () => {
  const { fieldBuilder, setFieldBuilder, addFieldBuilder, removeFieldBuilder } =
    useService();

  const updateItem = (index, value) => {
    setFieldBuilder((prev) => {
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
        {fieldBuilder.map((field, index) => (
          <FieldBuilderItem
            key={field.id ?? index}
            field={field}
            index={index}
            onChange={updateItem}
            onRemove={removeFieldBuilder}
          />
        ))}

        <Button
          startIcon={<AddIcon />}
          variant='outlined'
          onClick={addFieldBuilder}
        >
          Thêm Field Builder
        </Button>
      </CardContent>
    </Card>
  );
};

export default FieldBuildersSection;
