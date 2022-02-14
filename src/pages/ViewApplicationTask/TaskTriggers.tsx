import { useCallback, useState } from 'react';
import { Button } from '@ui/Button';
import ButtonGroup from '@ui/ButtonGroup';
import ContentSection from '@ui/ContentSection';
import { DataGrid } from '@ui/DataGrid';
import { Modal } from '@ui/Modal';
import TriggerPopupEditor from './TriggerPopupEditor';
import { mdiPlus, mdiTrashCan } from '@mdi/js';
import Icon from '@mdi/react';
import { TaskStandalone, TaskTrigger } from 'api/definition';
import { MD5 } from 'object-hash';
import { Shruggie } from 'pages/parts/misc';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';

function renderTriggerBody(trigger: TaskTrigger) {
  if (trigger.name === 'event') {
    return <NavLink to={`/events/${trigger.name}`}>{trigger.name}</NavLink>;
  }
  return <code>{trigger.body}</code>;
}

type TaskTriggersProps = {
  task: TaskStandalone;
};

function TaskTriggers({ task }: TaskTriggersProps) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<TaskTrigger[]>([]);
  const [selectedTrigger, setSelectedTrigger] = useState<
    TaskTrigger | undefined
  >();
  const [modalOpen, toggleModal] = useState(false);

  const deleteTriggers = () => {};
  const noItemsShruggie = (
    <Shruggie>
      <p>{t('noTaskTriggersDefined')}</p>
    </Shruggie>
  );

  const addTrigger = useCallback(() => {
    toggleModal(true);
    setSelected(undefined);
  }, []);

  return (
    <ContentSection padded header={t('triggers')}>
      <Modal open={!!selectedTrigger}>
        <TriggerPopupEditor
          appID={task.app._id}
          onClose={() => toggleModal(undefined)}
          trigger={selectedTrigger}
          taskID={task._id}
          taskName={task.qualified_name}
        />
      </Modal>

      <ButtonGroup>
        <Button left={<Icon size={0.7} path={mdiPlus} />} onClick={addTrigger}>
          {t('addTrigger')}
        </Button>

        <Button
          onClick={deleteTriggers}
          color="danger"
          disabled={selected.length === 0}
          left={<Icon size={0.7} path={mdiTrashCan} />}
        >
          {t('delete')}
        </Button>
      </ButtonGroup>

      <DataGrid<TaskTrigger>
        selectable
        keyFactory={MD5}
        data={task.triggers}
        onSelect={setSelected}
        noItemsRenderer={() => noItemsShruggie}
        columns={[
          {
            key: 'name',
            title: t('name'),
          },
          {
            key: '_body',
            title: t('triggerBody'),
            custom: true,
            render: renderTriggerBody,
          },
          {
            key: '_action',
            custom: true,
            title: '',
            render: (trigger) => (
              <Button onClick={() => setSelectedTrigger(trigger)}>
                {t('edit')}
              </Button>
            ),
          },
        ]}
      />
    </ContentSection>
  );
}

export default TaskTriggers;
