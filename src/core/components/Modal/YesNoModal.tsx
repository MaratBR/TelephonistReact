import React, { useCallback, useState } from 'react';
import { Button } from '@ui/Button';
import ButtonGroup from '@ui/ButtonGroup';
import { combineListeners } from '@ui/utils';
import ModalDialog from './ModalDialog';
import { useTranslation } from 'react-i18next';

interface YesNoModalProps {
  onYes?: () => any;
  onNo?: () => void;
  onCancel?: () => void;
  onClose?: () => void;
  children?: React.ReactNode;
  header?: React.ReactNode;
}

export default function YesNoModal({
  header,
  onNo,
  onYes,
  onCancel,
  onClose,
  children,
}: YesNoModalProps) {
  const { t } = useTranslation();
  const [isLoading, setLoading] = useState(false);
  const onYesCallback = useCallback(() => {
    if (onYes) {
      const result = onYes();
      if (result instanceof Promise) {
        setLoading(true);
        result.then((v) => {
          setLoading(false);
          if (onClose) onClose();
          return v;
        });
      } else if (onClose) onClose();
    } else if (onClose) onClose();
  }, [onYes]);

  return (
    <ModalDialog
      header={header ?? t('areYouSure')}
      onClose={combineListeners(onCancel, onClose)}
      footer={
        <ButtonGroup>
          <Button disabled={isLoading} loading={isLoading} onClick={onYesCallback}>
            {t('yes')}
          </Button>
          <Button disabled={isLoading} onClick={combineListeners(onNo, onClose)}>
            {t('no')}
          </Button>
        </ButtonGroup>
      }
    >
      {children}
    </ModalDialog>
  );
}
