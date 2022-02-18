import React, { useState } from 'react';
import { combineListeners } from '@ui/utils';
import S from './Input.module.scss';
import InputBox, { InputBoxVariant } from './InputBox';
import classNames from 'classnames';

type AnyInputProps = {
  variant?: InputBoxVariant;
  isInvalid?: boolean;
  value?: string;
};

export type InputProps = AnyInputProps & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value'>;

const Input = React.forwardRef(
  (
    { variant, isInvalid, onFocus, onBlur, ...props }: InputProps,
    ref: React.ForwardedRef<HTMLInputElement>
  ) => {
    const [focus, setFocus] = useState(false);
    return (
      <InputBox variant={variant} focused={focus} isInvalid={isInvalid}>
        <input
          onFocus={combineListeners(onFocus, () => setFocus(true))}
          onBlur={combineListeners(onBlur, () => setFocus(false))}
          className={classNames(S.input, {
            [S.invalid]: isInvalid,
          })}
          ref={ref}
          {...props}
        />
      </InputBox>
    );
  }
);

export default Input;
