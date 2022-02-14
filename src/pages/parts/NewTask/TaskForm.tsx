import { Form, FormError, SaveButton } from '@cc/Form';
import { Input, InputLayout, Select } from '@cc/Input';
import {
  DEFAULT_TASK_BODY,
  TaskStandalone,
  TaskTrigger,
  TASK_ARBITRARY,
  TASK_EXEC,
  TASK_SCRIPT,
} from 'api/definition';
import { useApi } from 'api/hooks';
import { useStateWithValidation } from 'core/hooks';
import { TFunction } from 'i18next';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ParametersStack } from '../Parameters';
import S from './TaskForm.module.scss';

type TaskFormProps = {
  task?: TaskStandalone;
  appID?: string;
  onSaved?: (task: TaskStandalone) => void;
};

function validateTaskName(taskName: string, t: TFunction) {
  if (taskName.length === 0)
    throw new Error(t('errEmptyString', { subject: t('taskName') }));
  if (!/^\w+$/.test(taskName)) {
    throw new Error(
      t('errInvalidFormat', {
        details: t('invalidIdentifier', { subject: t('taskName') }),
      })
    );
  }
}

export default function TaskForm({ task, appID, onSaved }: TaskFormProps) {
  const api = useApi();
  const { t } = useTranslation();
  const isNew = !task;

  // form values
  const {
    value: name,
    setValue: setName,
    error: nameError,
  } = useStateWithValidation('', (v) => validateTaskName(v, t));

  const [displayName, setDisplayName] = useState('');
  const [taskType, setTaskType] = useState<string | undefined>();
  const [body, setBody] = useState();
  const [env, setEnv] = useState<Record<string, string>>({});
  const [triggers, setTrigger] = useState<TaskTrigger[]>([]);

  useEffect(() => {
    setTaskType(task?.task_type);
    setName(task?.name);
    setTaskType(task?.task_type);
    setBody(task?.body);
  }, [task]);

  useEffect(() => {
    const factory = DEFAULT_TASK_BODY[taskType];
    if (factory) setBody(factory());
  }, [taskType]);

  const onSubmit = useCallback(async () => {
    if (isNew) {
      if (!appID) throw new Error('appID is not set, cannot save new task');
      const newTask = await api.defineNewApplicationTask(appID, {
        name,
        display_name: displayName,
        env,
        triggers,
        task_type: taskType,
        body,
      });
      if (onSaved) onSaved(newTask);
    } else {
      const newTask = await api.updateApplicationTask(appID, task._id, {
        name,
        body,
        task_type: taskType,
        env,
        triggers,
      });
      if (onSaved) onSaved(newTask);
    }
  }, [name, body, taskType, env, triggers, task]);

  return (
    <Form onSubmit={onSubmit} className={S.taskForm}>
      <FormError />
      <ParametersStack>
        <InputLayout id="name" header={t('name')}>
          <Input
            value={name}
            placeholder={t('name')}
            onChange={(e) => setName(e.target.value)}
          />
        </InputLayout>
        <InputLayout id="displayName" header={t('displayName')}>
          <Input
            value={displayName}
            placeholder={t('displayName')}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </InputLayout>
        <InputLayout id="taskType" header={t('taskType')}>
          <Select
            value={taskType}
            placeholder={t('taskType')}
            onChange={(e) => setTaskType(e.target.value)}
          >
            <option value={TASK_ARBITRARY}>{t('taskType.arbitrary')}</option>
            <option value={TASK_EXEC}>{t('taskType.exec')}</option>
            <option value={TASK_SCRIPT}>{t('taskType.script')}</option>
          </Select>
        </InputLayout>
        <InputLayout id="body" header={t('taskBody')}>
          123
        </InputLayout>
      </ParametersStack>
      <SaveButton />
    </Form>
  );
}
