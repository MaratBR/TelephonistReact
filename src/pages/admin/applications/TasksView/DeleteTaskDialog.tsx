import { Button } from '@ui/Button';
import ButtonGroup from '@ui/ButtonGroup';
import ErrorView from '@ui/Error';
import { ModalDialog } from '@ui/Modal';
import { Task } from 'api/definition';
import { useApi } from 'hooks';
import { Trans, useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';

interface DeleteTaskDialogProps {
  task: Task;
  onClose?: () => void;
  onDeleted?: () => void;
}

export default function DeleteTaskDialog({ task, onClose, onDeleted }: DeleteTaskDialogProps) {
  const { tasks } = useApi();
  const { t } = useTranslation();
  const name = task.qualified_name;

  const deleteTask = useMutation(async () => tasks.delete(task._id), {
    onSuccess: () => onDeleted(),
  });

  return (
    <ModalDialog
      footer={
        <ButtonGroup>
          <Button disabled={deleteTask.isLoading} color="primary" onClick={onClose}>
            {t('noCancel')}
          </Button>
          <Button
            disabled={deleteTask.isLoading}
            loading={deleteTask.isLoading}
            onClick={() => deleteTask.mutate()}
          >
            {t('yesDelete')}
          </Button>
        </ButtonGroup>
      }
      header={t('areYouSure')}
      onClose={onClose}
    >
      <p>
        <Trans t={t} i18nKey="doYouWantDeleteTask">
          Do you want to delete the task <b>{{ name }}</b>?
        </Trans>
      </p>
      <ErrorView error={deleteTask.error} />
    </ModalDialog>
  );
}
