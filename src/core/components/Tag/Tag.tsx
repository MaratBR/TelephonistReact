import React from 'react';
import { IconButton } from '@coreui/Button';
import { useColor } from '@coreui/theme';
import S from './Tag.module.scss';
import { mdiClose } from '@mdi/js';

interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: string;
  closeable?: boolean;
  onClose?: () => void;
}

function Tag({ color, children, closeable, style, ...props }: TagProps) {
  const tc = useColor(color);
  const newStyle: React.CSSProperties = tc
    ? {
        ...(style ?? {
          backgroundColor: tc.toString(),
          color: tc.isLight() ? 'black' : 'white',
        }),
      }
    : style;
  return (
    <div className={S.tag} style={newStyle} {...props}>
      {children}
      {closeable ? (
        <IconButton onClick={() => props?.onClose()} size={0.5} path={mdiClose} />
      ) : undefined}
    </div>
  );
}

export default React.forwardRef(Tag);
