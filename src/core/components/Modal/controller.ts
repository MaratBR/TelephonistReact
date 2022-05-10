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

export const ModalControllerContext = React.createContext<ModalController | null>(null);
