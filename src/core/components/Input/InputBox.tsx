import classNames from 'classnames';
import { HTMLAttributes, forwardRef } from 'react';
import S from './InputBox.module.scss';

export type InputBoxVariant = 'flushed' | 'none' | 'default'

const variants: Record<InputBoxVariant, string | undefined> = {
  flushed: S.flushed,
  default: S.default,
  none: undefined,
};

type InputBoxProps = {
  variant?: InputBoxVariant
  focused?: boolean
  isInvalid?: boolean
} & HTMLAttributes<HTMLDivElement>

const InputBox = forwardRef(({
  variant,
  focused,
  ...props
}: InputBoxProps) => (
  <div
    className={classNames(S.box, variants[variant ?? 'default'], { [S.focused]: focused })}
    {...props}
  />
));

export default InputBox;
