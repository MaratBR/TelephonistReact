import { combineListeners } from '@cc/utils';
import classNames from 'classnames';
import { useState } from 'react';
import InputBox, { InputBoxVariant } from './InputBox';
import S from './Textarea.module.scss';

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  variant?: InputBoxVariant;
  isInvalid?: boolean;
};

export default function Textarea({
  className,
  variant,
  onBlur,
  onFocus,
  ...props
}: TextareaProps) {
  const [focused, setFocused] = useState(false);
  return (
    <InputBox variant={variant} focused={focused}>
      <textarea
        onFocus={combineListeners(onFocus, () => setFocused(true))}
        onBlur={combineListeners(onBlur, () => setFocused(false))}
        className={classNames(S.textarea, className)}
        {...props}
      />
    </InputBox>
  );
}
