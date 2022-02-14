import { Button } from '@cc/Button';
import ButtonGroup from '@cc/ButtonGroup';
import { Modal } from '@cc/Modal';
import { mdiExclamationThick } from '@mdi/js';
import Icon from '@mdi/react';
import { Task, TaskStandalone } from 'api/definition';
import { DataGrid, renderBoolean } from 'core/components/DataGrid';
import Padded from 'pages/Padded';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { Shruggie } from '../misc';
import NewTaskModalDialog from '../NewTask/NewTaskModalDialog';
import S from './TasksView.module.scss';

type ApplicationTasksProps = {
  tasks: Task[];
  appID: string;
  onTaskDeleted?: (taskID: string) => void;
  onTaskAdded?: (task: TaskStandalone) => void;
};

export default function ApplicationTasks({
  tasks,
  appID,
  onTaskAdded,
  onTaskDeleted,
}: ApplicationTasksProps) {
  const { t } = useTranslation();

  const [modalOpen, toggleModal] = useState(false);

  const renderNoItems = () => (
    <Shruggie>
      <p>{t('noTasksPreset')}</p>
      <ButtonGroup>
        <Button onClick={() => toggleModal(true)}>{t('addTask')}</Button>
        <Button>{t('viewDeletedTasks')}</Button>
      </ButtonGroup>
    </Shruggie>
  );

  const actionButtons =
    tasks.length === 0 ? undefined : (
      <Padded>
        <ButtonGroup>
          <Button onClick={() => toggleModal(true)}>{t('addTask')}</Button>
        </ButtonGroup>
      </Padded>
    );

  return (
    <>
      <Modal open={modalOpen}>
        <NewTaskModalDialog
          appID={appID}
          onSaved={onTaskAdded}
          onClose={() => toggleModal(false)}
        />
      </Modal>
      {actionButtons}
      <DataGrid
        keyFactory={(v) => v._id}
        data={tasks}
        noItemsRenderer={renderNoItems}
        columns={[
          {
            key: '__id',
            custom: true,
            title: t('task'),
            render: (v) => {
              const [appName, taskName] = v.qualified_name.split('/');
              return (
                <div className={S.name}>
                  <NavLink to={`/applications/${v.app_id}/tasks/${v._id}`}>
                    <h2>
                      <span>{appName}</span>/<span>{taskName}</span>
                    </h2>
                  </NavLink>
                  <code>{v._id}</code>
                </div>
              );
            },
          },
          {
            key: 'disabled',
            title: t('disabled'),
            render: renderBoolean,
          },
          {
            title: t('taskType'),
            key: 'task_type',
          },
          {
            title: '',
            key: '__misc',
            custom: true,
            render: (v) => {
              if (v.errors !== {}) {
                return <Icon path={mdiExclamationThick} size={1} />;
              }
              return '';
            },
          },
        ]}
      />
    </>
  );
}
