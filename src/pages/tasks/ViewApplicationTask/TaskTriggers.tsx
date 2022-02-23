import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '@coreui/Button';
import ContentSection from '@coreui/ContentSection';
import { Stack } from '@coreui/Stack';
import Table from '@coreui/Table';
import { Dot } from '@coreui/misc';
import TaskTriggerRow from './TaskTriggerRow';
import { mdiClose, mdiContentSave, mdiPencil, mdiPlus } from '@mdi/js';
import Icon from '@mdi/react';
import { DEFAULT_TRIGGER_BODY, TRIGGER_EVENT, TaskTrigger } from 'api/definition';
import { useApi } from 'api/hooks';
import { getHashRecord } from 'core/utils';
import update from 'immutability-helper';
import { useTranslation } from 'react-i18next';
import { Shruggie } from 'ui/misc';

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
  let deletedTriggersCount = 0;
  let newTriggersCount = 0;

  for (const trigger of triggers) {
    if (trigger.isNew) {
      newTriggersCount += 1;
    } else if (trigger.isDeleted) {
      deletedTriggersCount += 1;
    }
  }
  return {
    newTriggersCount,
    deletedTriggersCount,
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
  const [entries, setEntries] = useState<TriggerEntry[]>([]);

  const reset = () => {
    setEntries(
      Object.entries(getHashRecord(triggers)).map(([id, trigger]) => ({
        id,
        trigger,
        isNew: false,
        isModified: false,
        isDeleted: false,
        original: trigger,
      }))
    );
  };

  useEffect(() => {
    reset();
  }, [triggers]);

  const addNew = useCallback(() => {
    setEntries((oldValue) => update(oldValue, { $push: [createDefaultTriggerEntry()] }));
  }, []);

  const setTriggerByIndex = useCallback((index: number, trigger: TaskTrigger) => {
    setEntries((oldValue) => {
      const old = oldValue[index];
      return update(oldValue, {
        [index]: {
          trigger: { $set: trigger },
          isModified: {
            $set: old.isNew || (old.original && !compareTriggers(old.original, trigger)),
          },
        },
      });
    });
  }, []);

  const setDeletedByIndex = useCallback((index: number, isDeleted: boolean) => {
    setEntries((oldValue) =>
      update(
        oldValue,
        oldValue[index].isNew
          ? { $splice: [[index, 1]] }
          : { [index]: { isDeleted: { $set: isDeleted } } }
      )
    );
  }, []);

  return {
    entries,
    addNew,
    setTriggerByIndex,
    setDeletedByIndex,
    reset,
    isAnythingModified: entries.some((e) => e.isModified || e.isDeleted),
  };
}

type TaskTriggersProps = {
  triggers: TaskTrigger[];
  taskID: string;
  onSave: (newTriggers: TaskTrigger[]) => void;
};

function TaskTriggers({ taskID, triggers, onSave }: TaskTriggersProps) {
  const { t } = useTranslation();
  const { tasks } = useApi();

  const [error, setError] = useState();
  const [saving, setSaving] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const { addNew, setDeletedByIndex, setTriggerByIndex, entries, isAnythingModified, reset } =
    useTriggers(triggers);

  const cancel = useCallback(() => {
    setEditing(false);
    reset();
  }, []);

  // hooks for tracking changes
  const { deletedTriggersCount, newTriggersCount } = useMemo(
    () => countTriggers(entries),
    [entries]
  );

  // saving the triggers
  const save = useCallback(() => {
    if (!isAnythingModified) return;
    const newTriggers = entries.filter((e) => !e.isDeleted).map((e) => e.trigger);
    setSaving(true);
    tasks
      .update(taskID, { triggers: newTriggers })
      .then(() => {
        if (onSave) onSave(newTriggers);
      })
      .catch(setError)
      .finally(() => {
        setSaving(false);
        setEditing(false);
      });
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
        <Button left={<Icon size={0.7} path={mdiClose} />} onClick={cancel}>
          {t('cancel')}
        </Button>
        <Button color="primary" left={<Icon size={0.7} path={mdiPlus} />} onClick={() => addNew()}>
          {t('addTrigger')}
        </Button>

        <Button
          color="success"
          disabled={!isAnythingModified}
          loading={saving}
          left={<Icon size={0.7} path={mdiContentSave} />}
          onClick={save}
        >
          {t('save')}
        </Button>

        <span>
          {t('triggersDeleted')}: {deletedTriggersCount} <br />
          {t('newTriggers')}: {newTriggersCount}
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
          {entries.length ? undefined : (
            <Shruggie>
              <p>{t('noTaskTriggersDefined')}</p>
            </Shruggie>
          )}
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

export default TaskTriggers;
