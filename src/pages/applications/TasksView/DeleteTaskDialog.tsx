import { useCallback, useState } from 'react';
import { Button } from '@coreui/Button';
import ButtonGroup from '@coreui/ButtonGroup';
import Error from '@coreui/Error';
import { ModalDialog } from '@coreui/Modal';
import { Task } from 'api/definition';
import { useApi } from 'api/hooks';
import { Trans, useTranslation } from 'react-i18next';

interface DeleteTaskDialogProps {
  task: Task;
  onClose?: () => void;
  onDeleted?: () => void;
}

export default function DeleteTaskDialog({ task, onClose, onDeleted }: DeleteTaskDialogProps) {
  const { tasks } = useApi();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const { t } = useTranslation();
  const name = task.qualified_name;

  const deleteTask = useCallback(async () => {
    setLoading(true);

    try {
      await tasks.delete(task._id);
      if (error) setError(undefined);
      if (onDeleted) onDeleted();
    } catch (exc) {
      setError(exc);
    } finally {
      setLoading(false);
    }
  }, [task]);

  return (
    <ModalDialog
      footer={
        <ButtonGroup>
          <Button disabled={loading} color="primary" onClick={onClose}>
            {t('noCancel')}
          </Button>
          <Button disabled={loading} loading={loading} onClick={deleteTask}>
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
      <Error error={error} />
    </ModalDialog>
  );
}
