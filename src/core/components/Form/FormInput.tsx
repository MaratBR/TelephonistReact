import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Input, InputProps } from '@ui/Input';
import { FormControl, FormControlsRegistryContext } from './context';
import { ValueCallback } from 'core/utils/types';

interface FormInputProps extends Omit<InputProps, 'onBlur'> {
  onValueFlushed?: ValueCallback<string>;
}

export default function FormInput({ onValueFlushed, value, ...props }: FormInputProps) {
  const [internalValue, setInternalValue] = useState('');
  const ctx = useContext(FormControlsRegistryContext);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const control = useMemo<FormControl>(
    () => ({
      flush: () => {
        if (onValueFlushed) onValueFlushed(internalValue);
      },
      validate: () => {},
      reset: () => {
        setInternalValue(value);
      },
    }),
    []
  );

  useEffect(() => {
    if (ctx !== null) {
      ctx.add(control);
      return () => ctx.remove(control);
    }
    return undefined;
  }, [ctx, control]);

  const onBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    if (onValueFlushed) {
      onValueFlushed(e.target.value);
    }
  }, []);

  return <Input value={internalValue} onBlur={onBlur} {...props} />;
}
