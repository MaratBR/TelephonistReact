import React from 'react';
import S from './Stack.module.scss';
import { css } from '@emotion/react';
import classNames from 'classnames';
import { maybeCSSVariable } from 'core/components/utils';

type StackProps = {
  horizontal?: boolean;
  spacing?: string;
  h?: boolean;
  wrap?: boolean;
} & Pick<React.CSSProperties, 'alignItems' | 'justifyContent'> &
  React.HTMLAttributes<HTMLDivElement>;

export function Stack({
  h,
  horizontal,
  alignItems,
  justifyContent,
  className,
  spacing,
  wrap,
  ...props
}: StackProps) {
  return (
    <div
      {...props}
      className={classNames(S.stack, className, {
        [S.horizontal]: h ?? horizontal,
      })}
      css={css({
        alignItems,
        justifyContent,
        '& > *:not(:last-child)': spacing
          ? { marginInlineEnd: maybeCSSVariable(spacing, 'spacing') }
          : undefined,
      })}
    />
  );
}
