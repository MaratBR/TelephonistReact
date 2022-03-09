import { useCallback, useMemo } from 'react';
import { Form, FormError, SaveButton } from '@coreui/Form';
import { Input, InputLayout } from '@coreui/Input';
import { TaskBodyEditor } from '../_common/TaskBodyEditor';
import S from './TaskForm.module.scss';
import { DEFAULT_TASK_BODY, DefineTask, TASK_SCRIPT, TaskStandalone } from 'api/definition';
import { useApi } from 'api/hooks';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ParametersStack } from 'ui/Parameters';
import { v4 as uuidv4 } from 'uuid';

type TaskFormProps = {
  appID?: string;
  onSaved?: (task: TaskStandalone) => void;
};

export default function TaskForm({ appID, onSaved }: TaskFormProps) {
  const api = useApi();
  const { t } = useTranslation();

  const { register, getValues, control } = useForm<DefineTask>({
    defaultValues: {
      name: '',
      body: {
        type: TASK_SCRIPT,
        value: DEFAULT_TASK_BODY[TASK_SCRIPT](),
      },
      description: '',
      display_name: '',
      tags: [],
    },
  });

  const newTaskID = useMemo(() => uuidv4(), []);

  const onSubmit = useCallback(async () => {
    if (!appID) throw new Error('appID is not set, cannot save new task');
    const newTask = await api.tasks.define(appID, {
      ...getValues(),
      _id: newTaskID,
    });
    if (onSaved) onSaved(newTask);
  }, []);

  return (
    <Form onSubmit={onSubmit} className={S.taskForm}>
      <FormError />
      <ParametersStack>
        <InputLayout id="name" header={t('name')}>
          <Input {...register('name')} placeholder={t('name')} />
        </InputLayout>
        <InputLayout id="displayName" header={t('displayName')}>
          <Input {...register('display_name')} placeholder={t('displayName')} />
        </InputLayout>
        <InputLayout id="body" header={t('taskBody')}>
          <Controller
            control={control}
            name="body"
            render={({ field: { value, onChange } }) => (
              <TaskBodyEditor
                value={value}
                onChange={(v) => {
                  console.log('onChange from TaskForm', v);
                  onChange(v);
                }}
              />
            )}
          />
        </InputLayout>
      </ParametersStack>
      <SaveButton />
    </Form>
  );
}
