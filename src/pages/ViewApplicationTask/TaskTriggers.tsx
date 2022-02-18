import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '@ui/Button';
import ContentSection from '@ui/ContentSection';
import { Stack } from '@ui/Stack';
import Table from '@ui/Table';
import { Dot } from '@ui/misc';
import TaskTriggerRow from './TaskTriggerRow';
import { mdiClose, mdiContentSave, mdiPencil, mdiPlus } from '@mdi/js';
import Icon from '@mdi/react';
import { DEFAULT_TRIGGER_BODY, TRIGGER_EVENT, TaskStandalone, TaskTrigger } from 'api/definition';
import { getHashRecord } from 'core/utils';
import update from 'immutability-helper';
import { observer } from 'mobx-react';
import { useTranslation } from 'react-i18next';

interface TriggerEntry {
  trigger: TaskTrigger;
  isDeleted: boolean;
  isNew: boolean;
  isModified: boolean;
  id: string;
  original?: TaskTrigger;
}

function compareTriggers(a: TaskTrigger, b: TaskTrigger) {
  return a.name === b.name && a.body === b.body;
}

function countTriggers(triggers: TriggerEntry[]) {
  let deletedTriggers = 0;
  let newTriggers = 0;

  for (const trigger of triggers) {
    if (trigger.isNew) {
      newTriggers += 1;
    } else if (trigger.isDeleted) {
      deletedTriggers += 1;
    }
  }
  return {
    newTriggers,
    deletedTriggers,
  };
}

function createDefaultTriggerEntry(): TriggerEntry {
  return {
    id: `new${Math.random().toString(36).substring(2)}`,
    trigger: {
      name: TRIGGER_EVENT,
      body: DEFAULT_TRIGGER_BODY[TRIGGER_EVENT](),
    },
    isNew: true,
    isModified: true,
    isDeleted: false,
  };
}

function useTriggers(triggers: TaskTrigger[]) {
  const originalTriggers = useMemo(() => getHashRecord(triggers), [triggers]);
  const [entries, setEntries] = useState<TriggerEntry[]>([]);
  useEffect(() => {
    setEntries(
      Object.entries(originalTriggers).map(([id, trigger]) => ({
        id,
        trigger,
        isNew: false,
        isModified: false,
        isDeleted: false,
        original: trigger,
      }))
    );
  }, [triggers]);

  const addNew = useCallback(() => {
    setEntries((oldValue) => update(oldValue, { $push: [createDefaultTriggerEntry()] }));
  }, []);

  const setTriggerByIndex = useCallback((index: number, trigger: TaskTrigger) => {
    console.log(trigger);
    setEntries((oldValue) => {
      const old = oldValue[index];
      return update(oldValue, {
        [index]: {
          trigger: { $set: trigger },
          isModified: { $set: old.original && !compareTriggers(old.original, trigger) },
        },
      });
    });
  }, []);

  const setDeletedByIndex = useCallback((index: number, isDeleted: boolean) => {
    setEntries((oldValue) => update(oldValue, { [index]: { isDeleted: { $set: isDeleted } } }));
  }, []);

  return {
    entries,
    addNew,
    setTriggerByIndex,
    setDeletedByIndex,
    isAnythingModified: entries.some((e) => e.isModified),
  };
}

type TaskTriggersProps = {
  task: TaskStandalone;
  onSave: (newTriggers: TaskTrigger[]) => void;
};

function TaskTriggers({ task, onSave }: TaskTriggersProps) {
  const { t } = useTranslation();
  const [isEditing, setEditing] = useState(false);
  const { addNew, setDeletedByIndex, setTriggerByIndex, entries, isAnythingModified } = useTriggers(
    task.triggers
  );

  // hooks for tracking changes
  const { deletedTriggers, newTriggers } = useMemo(() => countTriggers(entries), [entries]);

  // saving the triggers
  const save = useCallback(() => {
    if (!isAnythingModified) return;
    onSave(entries.map((e) => e.trigger));
  }, [entries, isAnythingModified]);

  // header and footer rows
  const hRow = (
    <tr>
      <th>{t('#')}</th>
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <th />
      <th>{t('triggerType')}</th>
      <th>{t('triggerBody')}</th>
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <th />
    </tr>
  );

  let actions: React.ReactNode;

  if (isEditing) {
    actions = (
      <>
        <Button left={<Icon size={0.7} path={mdiClose} />} onClick={() => setEditing(false)}>
          {t('cancel')}
        </Button>
        <Button color="primary" left={<Icon size={0.7} path={mdiPlus} />} onClick={() => addNew()}>
          {t('addTrigger')}
        </Button>

        <Button
          color="success"
          disabled={!isAnythingModified}
          left={<Icon size={0.7} path={mdiContentSave} />}
          onClick={save}
        >
          {t('save')}
        </Button>

        <span>
          {t('triggersDeleted')}: {deletedTriggers} <br />
          {t('newTriggers')}: {newTriggers}
        </span>
      </>
    );
  } else {
    actions = (
      <Button onClick={() => setEditing(true)} left={<Icon size={0.9} path={mdiPencil} />}>
        {t('edit')}
      </Button>
    );
  }

  return (
    <ContentSection
      padded
      header={
        <Stack h spacing="sm" alignItems="baseline">
          {t('triggers')}
          {isAnythingModified && <Dot />}
        </Stack>
      }
    >
      <Stack h spacing="md">
        {actions}
      </Stack>

      <Table>
        <thead>{hRow}</thead>
        <tbody>
          {entries.map((entry, index) => (
            <TaskTriggerRow
              editable={isEditing}
              isModified={entry.isModified}
              onDeletedChange={(deleted) => setDeletedByIndex(index, deleted)}
              onChange={(value) => setTriggerByIndex(index, value)}
              trigger={entry.trigger}
              isDeleted={entry.isDeleted}
              isNew={entry.isNew}
              index={index}
              key={entry.id}
            />
          ))}
        </tbody>
        <tfoot>{hRow}</tfoot>
      </Table>
    </ContentSection>
  );
}

export default observer(TaskTriggers);
