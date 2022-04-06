import { useState } from 'react';
import { Button } from '@ui/Button';
import ButtonGroup from '@ui/ButtonGroup';
import { Textarea } from '@ui/Input';
import { ModalDialog } from '@ui/Modal';
import { useApi } from 'hooks';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { useAppSelector } from 'store';

interface BlockUserDialogProps {
  onBlocked?: () => void;
  onClose?: () => void;
  userID: string;
  username: string;
}

export default function BlockUserDialog({
  userID,
  onClose,
  onBlocked,
  username,
}: BlockUserDialogProps) {
  const { t } = useTranslation();
  const selfID = useAppSelector((s) => s.auth.user._id);
  const { users } = useApi();
  const [reason, setReason] = useState<string>('');
  const blockUser = useMutation(() => users.block(userID, { reason }), { onSuccess: onBlocked });

  return (
    <ModalDialog
      onClose={onClose}
      footer={
        <ButtonGroup>
          <Button
            loading={blockUser.isLoading}
            disabled={blockUser.isLoading}
            onClick={() => {
              blockUser.mutate();
            }}
            color="danger"
          >
            {t('blockTheUser')}
          </Button>
          <Button onClick={onClose} color="primary">
            {t('cancel')}
          </Button>
        </ButtonGroup>
      }
      header={t('areYouSure')}
    >
      {selfID === userID ? <span>{t('youAreBlockingYourself')}</span> : undefined}
      <p>{t('wantBlockTheUser', { name: username, id: userID })}</p>
      <Textarea
        onChange={(e) => setReason(e.target.value)}
        placeholder={t('pleaseProvideReasonForBlock')}
        variant="flushed"
      />
    </ModalDialog>
  );
}
