import { useState } from 'react';
import { Alert } from '@ui/Alert';
import { Button } from '@ui/Button';
import ButtonGroup from '@ui/ButtonGroup';
import { Checkbox } from '@ui/Input';
import { ModalDialog } from '@ui/Modal';
import { Stack } from '@ui/Stack';
import { useApi } from 'hooks';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';

interface DeleteApplicationModalProps {
  appID: string;
  appName: string;
  onClose: () => void;
}

export default function DeleteApplicationModal({
  appID,
  appName,
  onClose,
}: DeleteApplicationModalProps) {
  const { t } = useTranslation();
  const api = useApi();
  const [completeWipe, setCompleteWipe] = useState(false);

  const deleteApplication = useMutation(
    () => api.applications.delete(appID, { wipe: completeWipe }),
    {
      onSuccess: () => onClose(),
    }
  );

  return (
    <ModalDialog
      footer={
        <ButtonGroup>
          <Button
            loading={deleteApplication.isLoading}
            disabled={deleteApplication.isLoading}
            color="danger"
            onClick={() => deleteApplication.mutate()}
          >
            {completeWipe
              ? t('application.deleteModal.completeWipe')
              : t('application.deleteModal.delete')}
          </Button>
          <Button onClick={onClose}>{t('cancel')}</Button>
        </ButtonGroup>
      }
      onClose={onClose}
    >
      <p>{t('application.deleteModal.warning', { id: appID, name: appName })}</p>
      <Stack h alignItems="center" spacing="sm">
        <Checkbox
          checked={completeWipe}
          id="completeWipe"
          onChange={(e) => setCompleteWipe(e.target.checked)}
        />
        <label htmlFor="completeWipe">{t('application.deleteModal.completeWipe')}</label>
      </Stack>
      {completeWipe ? (
        <Alert color="danger">{t('application.deleteModal.completeWipeWarning')}</Alert>
      ) : undefined}
    </ModalDialog>
  );
}
