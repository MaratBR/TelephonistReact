import { combineListeners } from '@cc/utils';
import classNames from 'classnames';
import React, { useState } from 'react';
import S from './Input.module.scss';
import InputBox, { InputBoxVariant } from './InputBox';

type AnyInputProps = {
  variant?: InputBoxVariant;
  isInvalid?: boolean;
};

type InputProps = AnyInputProps & JSX.IntrinsicElements['input'];

const variants = {
  flushed: S.flushed,
  minimal: S.minimal,
  standard: undefined,
};

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
