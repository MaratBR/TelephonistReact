import { useState } from 'react';
import { Button } from '@ui/Button';
import ButtonGroup from '@ui/ButtonGroup';
import ContentSection from '@ui/ContentSection';
import { DataGrid } from '@ui/DataGrid';
import { Modal } from '@ui/Modal';
import DeleteTaskModal from './DeleteTaskModal';
import { mdiPlus, mdiTrashCan } from '@mdi/js';
import Icon from '@mdi/react';
import { Task } from 'api/definition';
import { useApi } from 'api/hooks';
import Padded from 'pages/Padded';
import { Shruggie } from 'pages/parts/misc';
import { useTranslation } from 'react-i18next';

type EditTasksProps = {
  tasks: Task[];
  onTaskDeleted?: () => void;
};

export default function EditTasks({ tasks, onTaskDeleted }: EditTasksProps) {
  const { t } = useTranslation();
  const [deletedTask, setDeletedTask] = useState<Task | null>();
  const [deleteError, setDeleteError] = useState();
  const api = useApi();
  const deleteTask = async () => {
    try {
      await api.deleteApplicationTask(deletedTask.app_id, deletedTask._id);
    } catch (exc) {
      setDeleteError(exc);
    } finally {
      setDeletedTask(null);
    }
  };

  const sruggie = (
    <Shruggie>
      <p>{t('noApplicationTasks')}</p>
    </Shruggie>
  );

  return (
    <>
      <ContentSection header={t('tasks')}>
        <Padded>
          <ButtonGroup>
            <Button left={<Icon path={mdiPlus} size={0.9} />}>{t('addTask')}</Button>
          </ButtonGroup>
        </Padded>
        <DataGrid
          keyFactory={(task) => task._id}
          data={tasks}
          noItemsRenderer={() => sruggie}
          columns={[
            {
              key: '_id',
              title: t('id'),
              render: (id) => <code>{id}</code>,
            },
            {
              key: 'qualified_name',
              title: t('name'),
            },
            {
              key: 'task_type',
              title: t('taskType'),
            },
            {
              key: 'last_updated',
              title: t('lastUpdated'),
            },
            {
              key: '_actions',
              custom: true,
              title: '',
              render: (task) => (
                <ButtonGroup>
                  <Button
                    color="danger"
                    onClick={() => setDeletedTask(task)}
                    left={<Icon path={mdiTrashCan} size={0.9} />}
                  >
                    {t('delete')}
                  </Button>
                </ButtonGroup>
              ),
            },
          ]}
        />
      </ContentSection>
      <Modal open={!!deletedTask}>
        <DeleteTaskModal
          onDelete={deleteTask}
          onClose={() => setDeletedTask(null)}
          taskName={deletedTask?.qualified_name}
        />
      </Modal>
    </>
  );
}
