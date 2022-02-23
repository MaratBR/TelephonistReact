import { useContext } from 'react';
import Error from '@coreui/Error';
import { FormStatusContext } from './context';

export default function FormError() {
  const ctx = useContext(FormStatusContext);
  if (ctx.error) return <Error error={ctx.error} />;
  return null;
}
