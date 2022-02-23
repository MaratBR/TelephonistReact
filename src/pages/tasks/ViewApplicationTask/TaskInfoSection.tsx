import { useCallback, useState } from 'react';
import { Button } from '@coreui/Button';
import ButtonGroup from '@coreui/ButtonGroup';
import ContentSection from '@coreui/ContentSection';
import TaskEditor from './TaskEditor';
import TaskView from './TaskView';
import { mdiCancel, mdiContentSave, mdiPencil } from '@mdi/js';
import Icon from '@mdi/react';
import { TaskStandalone } from 'api/definition';
import { useTranslation } from 'react-i18next';

interface TaskActionsProps {
  isEditing: boolean;
  onReset: () => void;
  onSave: () => void;
  onRequestEdit: () => void;
}

function TaskActions({ isEditing, onRequestEdit, onReset, onSave }: TaskActionsProps) {
  const { t } = useTranslation();
  if (!isEditing) {
    return (
      <ButtonGroup>
        <Button onClick={onRequestEdit} left={<Icon path={mdiPencil} size={0.9} />}>
          {t('edit')}
        </Button>
      </ButtonGroup>
    );
  }

  return (
    <ButtonGroup>
      <Button onClick={onReset} left={<Icon path={mdiCancel} size={0.9} />}>
        {t('reset')}
      </Button>
      <Button color="success" onClick={onSave} left={<Icon path={mdiContentSave} size={0.9} />}>
        {t('save')}
      </Button>
    </ButtonGroup>
  );
}

type TaskInfoSectionProps = {
  task: TaskStandalone;
};

export default function TaskInfoSection({ task }: TaskInfoSectionProps) {
  const { t } = useTranslation();
  const [isEditing, setEditing] = useState(false);

  const onRequestEdit = useCallback(() => setEditing(true), []);
  const onReset = useCallback(() => {
    setEditing(false);
  }, []);
  const onSave = useCallback(() => {}, []);

  return (
    <ContentSection padded header={t('generalInformation')}>
      <TaskActions
        onRequestEdit={onRequestEdit}
        onReset={onReset}
        onSave={onSave}
        isEditing={isEditing}
      />
      {isEditing ? <TaskEditor task={task} /> : <TaskView task={task} />}
    </ContentSection>
  );
}
