import { useContext } from 'react';
import { ModalContext } from '@coreui/Modal';

export default function useModal() {
  const context = useContext(ModalContext);
  if (context === null)
    throw new Error('ModalContext is null, did you added ModalProvider as a parent compoenent?');
  return context;
}
