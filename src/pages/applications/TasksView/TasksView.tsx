import { useCallback, useState } from 'react';
import { Button } from '@coreui/Button';
import ButtonGroup from '@coreui/ButtonGroup';
import { Modal } from '@coreui/Modal';
import { combineListeners } from '@coreui/utils';
import { Shruggie } from '../../../ui/misc';
import NewTaskModalDialog from '../../tasks/NewTask/NewTaskModalDialog';
import DeleteTaskDialog from './DeleteTaskDialog';
import S from './TasksView.module.scss';
import { mdiExclamationThick, mdiTrashCan } from '@mdi/js';
import Icon from '@mdi/react';
import { Task, TaskStandalone } from 'api/definition';
import { useApi } from 'api/hooks';
import { DataGrid, renderBoolean } from 'core/components/DataGrid';
import { useModal } from 'core/hooks';
import Padded from 'pages/Padded';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';

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
  const modal = useModal();
  const [modalOpen, toggleModal] = useState(false);
  const api = useApi();

  const deleteTask = useCallback((task: Task) => {
    modal(({ onClose }) => (
      <DeleteTaskDialog
        task={task}
        onClose={onClose}
        onDeleted={combineListeners(onClose, () => onTaskDeleted(task._id))}
      />
    ));
  }, []);

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
                  <NavLink to={`/tasks/${v.app_name}/${v.name}`}>
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
          {
            title: '',
            key: '_actions',
            custom: true,
            render: (v) => (
              <ButtonGroup>
                <Button
                  variant="ghost"
                  onClick={() => deleteTask(v)}
                  color="danger"
                  left={<Icon path={mdiTrashCan} size={0.9} />}
                >
                  {t('delete')}
                </Button>
              </ButtonGroup>
            ),
          },
        ]}
      />
    </>
  );
}
