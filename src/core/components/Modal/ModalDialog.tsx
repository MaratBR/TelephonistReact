import { IconButton } from '@cc/Button';
import { mdiClose } from '@mdi/js';
import S from './ModalDialog.module.scss';

interface ModalDialogProps {
  header?: React.ReactNode;
  onClose?: () => void;
  children?: React.ReactNode;
  footer?: React.ReactNode;
}

function ModalDialog({
  header,
  children,
  onClose,
  footer,
}: ModalDialogProps) {
  return (
    <div className={S.modal}>
      <div className={S.header}>
        <h4>{header}</h4>

        <IconButton
          className={S.close}
          size={0.9}
          path={mdiClose}
          onClick={onClose}
        />
      </div>

      <div className={S.body}>{children}</div>
      {
        footer ? <div className={S.footer}>{footer}</div> : undefined
      }
    </div>
  );
}

export default ModalDialog;
