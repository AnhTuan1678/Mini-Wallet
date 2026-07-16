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
