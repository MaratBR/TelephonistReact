import React from 'react';
import { Button } from '@ui/Button';
import { Select } from '@ui/Input';
import Tag from '@ui/Tag';
import { Dot } from '@ui/misc';
import S from './TaskTriggerRow.module.scss';
import TriggerBodyView from './TriggerBodyView';
import { mdiTrashCan } from '@mdi/js';
import Icon from '@mdi/react';
import { DEFAULT_TRIGGER_BODY, TaskTrigger } from 'api/definition';
import { useTranslation } from 'react-i18next';

export interface TriggerEntry {
  trigger: TaskTrigger;
  deleted: boolean;
  isNew: boolean;
}

interface TaskTriggerRowProps {
  editable: boolean;
  trigger: TaskTrigger;
  isModified: boolean;
  isNew: boolean;
  isDeleted: boolean;
  onChange: (trigger: TaskTrigger) => void;
  onDeletedChange: (deleted: boolean) => void;
  index: number;
}

function TaskTriggerRow({
  trigger,
  isModified,
  isNew,
  isDeleted,
  onDeletedChange,
  editable,
  onChange,
  index,
}: TaskTriggerRowProps) {
  const { t } = useTranslation();

  let actions: React.ReactNode;

  const deleteButton = (
    <Button onClick={() => onDeletedChange(true)}>
      <Icon path={mdiTrashCan} size={0.9} />
    </Button>
  );

  if (isDeleted) {
    return (
      <tr>
        <td>{index + 1}</td>
        <td colSpan={3}>
          <div className={S.deleted}>
            <span>{t('triggerHasBeenDeleted')}</span>
            <Button onClick={() => onDeletedChange(false)} variant="link">
              {t('restore')}
            </Button>
          </div>
        </td>
      </tr>
    );
  }

  if (editable) {
    actions = (
      <>
        {isNew ? <Tag color="primary">{t('new')}</Tag> : undefined}
        {deleteButton}
      </>
    );
  }

  return (
    <tr className={S.row}>
      <td width="1%">{index + 1}</td>
      <td width="4%">{isModified && <Dot />}</td>
      <td width="25%">
        {editable ? (
          <Select<string>
            selected={trigger.name}
            options={Object.keys(DEFAULT_TRIGGER_BODY)}
            keyFactory={(v) => v}
            onSelect={(name) => onChange({ ...trigger, name })}
          />
        ) : (
          trigger.name
        )}
      </td>
      <td>
        <TriggerBodyView
          triggerType={trigger.name}
          onChange={(body) => onChange({ ...trigger, body })}
          editable={editable}
          body={trigger.body}
        />
      </td>
      <td width="1%">
        <div className={S.actions}>{actions}</div>
      </td>
    </tr>
  );
}

export default TaskTriggerRow;
