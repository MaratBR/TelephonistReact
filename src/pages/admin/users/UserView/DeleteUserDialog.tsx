import { Button } from '@ui/Button';
import ButtonGroup from '@ui/ButtonGroup';
import { ModalDialog } from '@ui/Modal';
import { useApi } from 'hooks';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { useAppSelector } from 'store';

interface BlockUserDialogProps {
  onDeleted?: () => void;
  onClose?: () => void;
  userID: string;
  username: string;
}

export default function DeleteUserDialog({
  userID,
  onClose,
  onDeleted,
  username,
}: BlockUserDialogProps) {
  const { t } = useTranslation();
  const selfID = useAppSelector((s) => s.auth.user._id);
  const { users } = useApi();
  const deleteUser = useMutation(() => users.delete(userID), { onSuccess: onDeleted });

  const cancelButton = (
    <Button onClick={onClose} color="primary">
      {t('cancel')}
    </Button>
  );

  if (userID === selfID) {
    return (
      <ModalDialog onClose={onClose} footer={cancelButton}>
        <p>{t('user.deleteYourselfWarning')}</p>
      </ModalDialog>
    );
  }

  return (
    <ModalDialog
      onClose={onClose}
      footer={
        <ButtonGroup>
          <Button
            loading={deleteUser.isLoading}
            disabled={deleteUser.isLoading}
            onClick={() => {
              deleteUser.mutate();
            }}
            color="danger"
          >
            {t('user.delete')}
          </Button>
          {cancelButton}
        </ButtonGroup>
      }
      header={t('areYouSure')}
    >
      <p>{t('user.deleteWarning', { name: username, id: userID })}</p>
    </ModalDialog>
  );
}
