import { ModalDialog } from '@ui/Modal';
import TaskForm from './TaskForm';
import { TaskStandalone } from 'api/definition';
import { useTranslation } from 'react-i18next';

type NewTaskModalDialogProps = {
  onClose: () => void;
  appID: string;
  onSaved?: (task: TaskStandalone) => void;
};

export default function NewTaskModalDialog({
  onClose,
  appID,
  onSaved,
}: NewTaskModalDialogProps) {
  const { t } = useTranslation();
  return (
    <ModalDialog onClose={onClose} header={t('newTask')}>
      <TaskForm appID={appID} onSaved={onSaved} />
    </ModalDialog>
  );
}
