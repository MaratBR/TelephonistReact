import { Button } from '@cc/Button';
import ButtonGroup from '@cc/ButtonGroup';
import { Card } from '@cc/Card';
import ContentSection from '@cc/ContentSection';
import { DataGrid } from '@cc/DataGrid';
import { ModalDialog } from '@cc/Modal';
import { mdiPlus, mdiTrashCan } from '@mdi/js';
import Icon from '@mdi/react';
import { models } from 'api';
import { MD5 } from 'object-hash';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';

function renderTriggerBody(trigger: models.TaskTrigger) {
  if (trigger.name === 'event') {
    return <NavLink to={`/events/${trigger.name}`}>{trigger.name}</NavLink>;
  }
  return <code>{trigger.body}</code>;
}

type TaskTriggersProps = {
  task: models.ApplicationTask;
};

function TaskTriggers({ task }: TaskTriggersProps) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<models.TaskTrigger[]>([]);

  const deleteTriggers = () => {};

  return (
    <ContentSection padded header={t('triggers')}>
      <ModalDialog header="Test header" open>
        <Card>Hello!</Card>
      </ModalDialog>

      <ButtonGroup>
        <Button left={<Icon size={0.7} path={mdiPlus} />}>
          {t('add_trigger')}
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
      <DataGrid<models.TaskTrigger>
        selectable
        keyFactory={MD5}
        data={task.triggers}
        onSelect={setSelected}
        columns={[
          {
            key: 'name',
            title: t('name'),
          },
          {
            key: '_body',
            title: t('trigger_body'),
            custom: true,
            render: renderTriggerBody,
          },
          {
            key: '_action',
            custom: true,
            title: '',
            render: (trigger) => <Button>{t('edit')}</Button>,
          },
        ]}
      />
    </ContentSection>
  );
}

export default TaskTriggers;
