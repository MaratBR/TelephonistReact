import { Textarea } from '@coreui/Input';
import { Parameters } from '@coreui/Parameters';
import { TaskBodyEditor } from '../_common/TaskBodyEditor';
import { UpdateTask } from 'api/definition';
import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface TaskEditorProps {
  control: Control<UpdateTask>;
}

export default function TaskEditor({ control }: TaskEditorProps) {
  const { t } = useTranslation();

  return (
    <Parameters
      parameters={{
        [t('description')]: <Textarea {...control.register('description')} />,
        [t('taskBody')]: (
          <Controller<UpdateTask>
            control={control}
            name="body"
            render={({ field: { value, onChange } }) => (
              <TaskBodyEditor onChange={onChange} value={value} />
            )}
          />
        ),
      }}
    />
  );
}
