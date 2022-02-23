import { Button } from '@coreui/Button';
import ButtonGroup from '@coreui/ButtonGroup';
import { ModalDialog } from '@coreui/Modal';
import { useTranslation } from 'react-i18next';

type DeleteTaskModalProps = {
  taskName: string;
  onDelete: () => void;
  onClose: () => void;
};

export default function DeleteTaskModal({ taskName, onDelete, onClose }: DeleteTaskModalProps) {
  const { t } = useTranslation();

  return (
    <ModalDialog
      onClose={onClose}
      footer={
        <ButtonGroup>
          <Button onClick={onClose}>{t('cancel')}</Button>

          <Button color="danger" onClick={onDelete}>
            {t('delete')}
          </Button>
        </ButtonGroup>
      }
      header={t('attention')}
    >
      <p>{t('deleteAppTaskWarn', { taskName })}</p>
      <span>{t('actionCanBeUndone')}</span>
    </ModalDialog>
  );
}
