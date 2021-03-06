import React from 'react';
import S from './Modal.module.scss';
import classNames from 'classnames';
import ReactDOM from 'react-dom';

interface ModalContext {}

type ModalRender = (context: ModalContext) => React.ReactNode;

export interface ModalProps {
  open?: boolean;
  children?: React.ReactNode | ModalRender;
}

class Modal extends React.Component<ModalProps> {
  private _render() {
    const { open, children } = this.props;
    if (!open) {
      return null;
    }

    return (
      <div className={classNames(S.root)}>
        <div className={S.body}>{typeof children === 'function' ? children({}) : children}</div>
      </div>
    );
  }

  render() {
    return ReactDOM.createPortal(this._render(), document.body);
  }
}

export default Modal;
