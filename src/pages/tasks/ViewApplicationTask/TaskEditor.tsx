import { useEffect, useState } from 'react';
import { Textarea } from '@coreui/Input';
import { Parameters } from '@coreui/Parameters';
import { TaskBodyEditor } from '../_common/taskBody';
import { DEFAULT_TASK_BODY, TaskStandalone } from 'api/definition';
import TaskTypeSelect from 'pages/tasks/_common/TaskTypeSelect';
import { useTranslation } from 'react-i18next';

interface TaskEditorProps {
  task: TaskStandalone;
}

export default function TaskEditor({ task }: TaskEditorProps) {
  const [description, setDescription] = useState('');
  const [body, setBody] = useState(task.body);
  const [_disabled, setDisabled] = useState(false);
  const [type, setType] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    setBody(task.body);
    setDescription(task.description);
    setDisabled(task.disabled);
    setType(task.task_type);
  }, [task]);

  useEffect(() => {
    const factory = DEFAULT_TASK_BODY[type];
    if (factory) setBody(factory());
  }, [type]);

  return (
    <Parameters
      parameters={{
        [t('description')]: (
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        ),
        [t('taskType')]: <TaskTypeSelect selected={type} onChange={setType} />,
        [t('taskBody')]: <TaskBodyEditor onChange={setBody} body={body} type={type} />,
      }}
    />
  );
}
