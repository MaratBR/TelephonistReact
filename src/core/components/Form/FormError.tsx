import { useContext } from 'react';
import ErrorView from '@ui/Error';
import { FormStatusContext } from './context';

export default function FormError() {
  const ctx = useContext(FormStatusContext);
  if (ctx.error) return <ErrorView error={ctx.error} />;
  return null;
}
