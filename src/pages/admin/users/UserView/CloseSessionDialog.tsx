import { Button } from '@ui/Button';
import ButtonGroup from '@ui/ButtonGroup';
import { ModalDialog } from '@ui/Modal';
import { useApi } from 'hooks';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';

interface Props {
  onSessionClosed: () => void;
  onClose: () => void;
  username: string;
  sessionRefID: string;
  userID: string;
}

export default function CloseSessionDialog({
  username,
  sessionRefID,
  userID,
  onSessionClosed,
  onClose,
}: Props) {
  const { t } = useTranslation();
  const { users } = useApi();
  const closeSession = useMutation(() => users.closeSession(userID, sessionRefID), {
    onSuccess: onSessionClosed,
    onMutate: onClose,
  });
  return (
    <ModalDialog
      footer={
        <ButtonGroup>
          <Button
            loading={closeSession.isLoading}
            disabled={closeSession.isLoading}
            onClick={() => closeSession.mutate()}
            color="danger"
          >
            {t('yes')}
          </Button>
          <Button disabled={closeSession.isLoading} onClick={onClose}>
            {t('no')}
          </Button>
        </ButtonGroup>
      }
      header={t('areYouSure')}
      onClose={onClose}
    >
      {t('sessions.wantClose', { username, id: sessionRefID })}
    </ModalDialog>
  );
}
