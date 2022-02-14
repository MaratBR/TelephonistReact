import React from 'react';
import { IconButton } from '@ui/Button';
import S from './Tag.module.scss';
import { Interpolation, css } from '@emotion/react';
import { mdiClose } from '@mdi/js';
import tinycolor from 'tinycolor2';

interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: string;
  closeable?: boolean;
  onClose?: () => void;
}

function Tag({ color, children, closeable, ...props }: TagProps) {
  let c: Interpolation<any>;
  if (color) {
    const tc = tinycolor(color);
    c = css`
      background-color: ${tc.toString()};
      color: ${tc.isLight() ? 'black' : 'white'};
    `;
  }

  return (
    <div className={S.tag} css={c} {...props}>
      {children}
      {closeable ? (
        <IconButton
          onClick={() => props?.onClose()}
          size={0.5}
          path={mdiClose}
        />
      ) : undefined}
    </div>
  );
}

export default React.forwardRef(Tag);
