import { useCallback, useEffect, useMemo, useState } from 'react';
import { Form, FormError, SaveButton } from '@coreui/Form';
import { Input, InputLayout } from '@coreui/Input';
import TaskTypeSelect from '../_common/TaskTypeSelect';
import { TaskBodyEditor } from '../_common/taskBody';
import S from './TaskForm.module.scss';
import { DEFAULT_TASK_BODY, TASK_SCRIPT, TaskStandalone, TaskTrigger } from 'api/definition';
import { useApi } from 'api/hooks';
import { useStateWithValidation } from 'core/hooks';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { ParametersStack } from 'ui/Parameters';
import { v4 as uuidv4 } from 'uuid';

type TaskFormProps = {
  task?: TaskStandalone;
  appID?: string;
  onSaved?: (task: TaskStandalone) => void;
};

function validateTaskName(taskName: string, t: TFunction) {
  if (taskName.length === 0) throw new Error(t('errEmptyString', { subject: t('taskName') }));
  if (!/^\w+$/.test(taskName)) {
    throw new Error(
      t('errInvalidFormat', {
        details: t('invalidIdentifier', { subject: `"${taskName}"` }),
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

  const newTaskID = useMemo(() => (task ? uuidv4() : undefined), [task]);
  const [displayName, setDisplayName] = useState('');
  const [taskType, setTaskType] = useState<string | undefined>();
  const [body, setBody] = useState();
  const [description, setDescription] = useState('');
  const [env, setEnv] = useState<Record<string, string>>({});
  const [tags, setTags] = useState<string[]>([]);
  const [triggers, setTrigger] = useState<TaskTrigger[]>([]);
  const bodyCache = useMemo<Record<string, any>>(() => ({}), []);

  useEffect(() => {
    setTaskType(task?.task_type ?? TASK_SCRIPT);
    setName(task?.name ?? '');
    setBody(task?.body ?? DEFAULT_TASK_BODY[TASK_SCRIPT]());
    setDescription(task?.description ?? '');
  }, [task]);

  const setTypeX = useCallback(
    (value: string) => {
      if (taskType === value) return;
      bodyCache[taskType] = body;
      setTaskType(value);
      if (bodyCache[value]) {
        setBody(bodyCache[value]);
      } else {
        const bodyFactory = DEFAULT_TASK_BODY[value];
        if (bodyFactory) {
          setBody(bodyFactory());
        }
      }
    },
    [taskType, body]
  );

  const onSubmit = useCallback(async () => {
    if (isNew) {
      if (!appID) throw new Error('appID is not set, cannot save new task');
      const newTask = await api.tasks.define(appID, {
        name,
        display_name: displayName,
        env,
        triggers,
        task_type: taskType,
        body,
        description,
        tags,
        _id: newTaskID,
      });
      if (onSaved) onSaved(newTask);
    } else {
      const newTask = await api.tasks.update(task._id, {
        name,
        body,
        task_type: taskType,
        display_name: displayName,
        env,
        triggers,
        description,
        tags,
      });
      if (onSaved) onSaved(newTask);
    }
  }, [name, body, taskType, env, triggers, task]);

  return (
    <Form onSubmit={onSubmit} className={S.taskForm}>
      <FormError />
      <ParametersStack>
        <InputLayout id="name" header={t('name')}>
          <Input value={name} placeholder={t('name')} onChange={(e) => setName(e.target.value)} />
        </InputLayout>
        <InputLayout id="displayName" header={t('displayName')}>
          <Input
            value={displayName}
            placeholder={t('displayName')}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </InputLayout>
        <InputLayout id="taskType" header={t('taskType')}>
          <TaskTypeSelect selected={taskType} onChange={setTypeX} />
        </InputLayout>
        <InputLayout id="body" header={t('taskBody')}>
          <TaskBodyEditor body={body} type={taskType} onChange={setBody} />
        </InputLayout>
      </ParametersStack>
      <SaveButton />
    </Form>
  );
}
