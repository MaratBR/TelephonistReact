import React from 'react';
import { Input, InputProps } from '@ui/Input';
import InputErrors from './InputErrors';
import { Validation, Validator } from './Validation';

interface ValidatedInputProps extends InputProps {
  validators: Validator<string>[];
}

const ValidatedInput = React.forwardRef<HTMLInputElement, ValidatedInputProps>(
  ({ validators, ...props }, ref) => {
    return (
      <div>
        <Input ref={ref} {...props} />
        <Validation validators={validators} value={props.value}>
          {({ errors }) => <InputErrors errors={errors} />}
        </Validation>
      </div>
    );
  }
);
export default ValidatedInput;
