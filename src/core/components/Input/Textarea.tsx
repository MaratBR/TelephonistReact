import { useState } from 'react';
import { combineListeners } from '@ui/utils';
import InputBox, { InputBoxVariant } from './InputBox';
import S from './Textarea.module.scss';
import classNames from 'classnames';

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  variant?: InputBoxVariant;
  isInvalid?: boolean;
};

export default function Textarea({ className, variant, onBlur, onFocus, ...props }: TextareaProps) {
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
