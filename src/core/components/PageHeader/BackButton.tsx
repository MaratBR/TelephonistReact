import { IconButton } from '@ui/Button';
import { mdiArrowLeft } from '@mdi/js';
import { VoidCallback } from 'core/utils/types';
import { To } from 'react-router';
import { NavLink } from 'react-router-dom';

interface BackButtonProps {
  action: VoidCallback | To;
}

export default function BackButton({ action }: BackButtonProps) {
  if (typeof action === 'function')
    return <IconButton path={mdiArrowLeft} size={1} onClick={action} />;
  return (
    <NavLink to={action}>
      <IconButton path={mdiArrowLeft} size={1} />
    </NavLink>
  );
}
