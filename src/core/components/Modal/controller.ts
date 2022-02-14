import React from 'react';

interface ModalContext {
  close(): void;
  id: string;
}

type RenderModal = (context: ModalContext) => React.ReactNode;

interface ModalOptions {
  render: RenderModal;
  id?: string;
}

interface Modal {
  close(): void;
  id: string;
}

interface ModalController {
  open(options: ModalOptions): Modal;
  close(id: string);
}

export interface ModalListener {
  onModalOpen(options: ModalOptions);
  onModalClosed(id: string);
}

class ModalControllerImpl implements ModalController {
  private _listener: ModalListener | null;

  setCallback(callback: ModalListener | null) {
    this._listener = callback;
  }

  open(options: ModalOptions): Modal {
    const id =
      options.id ??
      `${Math.random().toString(36).substring(2)}_${Math.floor(
        Date.now() / 1000
      )}`;

    this._listener.onModalOpen(options);

    return {
      id,
      close: () => this.close(id),
    };
  }

  close(id: string) {
    this._listener.onModalClosed(id);
  }
}

export const ModalControllerContext =
  React.createContext<ModalController | null>(null);
