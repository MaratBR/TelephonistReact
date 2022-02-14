import { css } from '@emotion/react';
import Icon from '@mdi/react';
import classNames from 'classnames';
import { ButtonHTMLAttributes } from 'react';
import S from './IconButton.module.scss';

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: number;
  path?: string;
};

export default function IconButton({
  className,
  size,
  children,
  path,
  ...props
}: IconButtonProps) {
  const sizeWithUnit = Number.isNaN(+size) ? size : `${size * 3.3}em`;
  return (
    <button
      type="button"
      css={css({
        height: sizeWithUnit,
        width: sizeWithUnit,
      })}
      className={classNames(className, S.button)}
      {...props}
    >
      {children ?? (path ? <Icon path={path} size={size} /> : undefined)}
    </button>
  );
}
