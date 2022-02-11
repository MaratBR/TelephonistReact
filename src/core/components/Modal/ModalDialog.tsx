import { IconButton } from '@cc/Button';
import { mdiClose } from '@mdi/js';
import Icon from '@mdi/react';
import Modal, { ModalProps } from './Modal';
import S from './ModalDialog.module.scss';

interface ModalDialogProps extends ModalProps {
  header?: React.ReactNode;
}

function ModalDialog({ open, header, children }: ModalDialogProps) {
  return (
    <Modal open={open}>
      <div className={S.modal}>
        <div className={S.header}>
          <h4>{header}</h4>

          <IconButton className={S.close}>
            <Icon size={0.9} path={mdiClose} />
          </IconButton>
        </div>

        <div className={S.body}>{children}</div>
      </div>
    </Modal>
  );
}

export default ModalDialog;
