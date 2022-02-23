import React, { useMemo, useState } from 'react';
import Modal from './Modal';
import update from 'immutability-helper';

export interface RenderedModalProps {
  onClose(): void;
}

export type RenderModalFunction = (context: RenderedModalProps) => React.ReactNode;

export interface IModalContext {
  (render: RenderModalFunction): string;
  close(id: string): void;
}

export const ModalContext = React.createContext<IModalContext | null>(null);

interface ModalObject {
  render: RenderModalFunction;
  props: RenderedModalProps;
}

export function ModalProvider({ children }: React.PropsWithChildren<{}>) {
  const [modals, setModals] = useState<Record<string, ModalObject>>({});
  const context = useMemo<IModalContext>(() => {
    const add = (render: RenderModalFunction) => {
      const newId = Math.random().toString(36).substring(2);
      setModals((value) => ({
        ...value,
        [newId]: {
          render,
          props: {
            onClose: () => add.close(newId),
          },
        },
      }));
      return newId;
    };
    add.close = (id: string) => {
      setModals((value) => update(value, { $unset: [id] }));
    };
    return add;
  }, []);
  return (
    <ModalContext.Provider value={context}>
      {children}
      {Object.entries(modals).map(([id, { render, props }]) => (
        <Modal open key={id}>
          {render(props)}
        </Modal>
      ))}
    </ModalContext.Provider>
  );
}
