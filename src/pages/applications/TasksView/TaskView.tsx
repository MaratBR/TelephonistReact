import { useState } from 'react';
import { Button } from '@coreui/Button';
import { Input, Textarea } from '@coreui/Input';
import { Parameters } from '@coreui/Parameters';
import Tags from '@coreui/Tags';
import S from './TaskView.module.scss';
import { mdiPencil } from '@mdi/js';
import Icon from '@mdi/react';
import { Task } from 'api/definition';
import cn from 'classnames';
import { useTranslation } from 'react-i18next';
import ReactJson from 'react-json-view';

type TaskBodyProps = {
  value: any;
  type: string;
};

function TaskBodyView({ value, type }: TaskBodyProps) {
  if (type === 'arbitrary') {
    return <ReactJson src={value} />;
  }
  if (type === 'exec') {
    return <Input value={value} readOnly />;
  }
  if (type === 'script') {
    return <Textarea value={value} readOnly />;
  }

  return <span>invalid task type</span>;
}

type TaskViewProps = {
  task: Task;
  editable?: boolean;
};

export function TaskView({ task, editable }: TaskViewProps) {
  const [appName, taskName] = task.qualified_name.split('/');
  const [collapsed, setCollapsed] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const { t } = useTranslation();

  let body;

  if (!collapsed) {
    if (editMode) {
      body = 'TODO';
    } else {
      body = (
        <>
          <div className={S.buttons}>
            <Button left={<Icon path={mdiPencil} size={1} />}>{t('edit')}</Button>
          </div>
          <Parameters
            parameters={{
              [t('id')]: <code>{task._id}</code>,
              [t('name')]: `${task.name} (${task.qualified_name})`,
              [t('description')]: task.description,
              [t('taskType')]: <span>{task.task_type}</span>,
              [t('taskBody')]: <TaskBodyView value={task.body} type={task.task_type} />,
              [t('tags')]: <Tags tags={task.tags} />,
            }}
          />
        </>
      );
    }
  }

  return (
    <div className={cn(S.root, { [S.expanded]: !collapsed })} role="button">
      <div
        role="button"
        tabIndex={-1}
        className={S.header}
        onClick={() => setCollapsed(!collapsed)}
      >
        <h3>
          <span className={S.appName}>{appName}/</span>
          <span>{taskName}</span>
        </h3>
        <span className={S.id}>{task._id}</span>
      </div>

      <div className={S.body}>{body}</div>
    </div>
  );
}
