import { useMemo } from 'react';

interface ValidationResult {
  errors: string[];
}

interface ValidationContext<T> {
  value: T;
  errors: string[];
}

export type Validator<T> = (value: T) => ValidationResult | null;

interface ValidationProps<T> {
  value: T;
  validators: Validator<T>[];
  children: (context: ValidationContext<T>) => React.ReactNode;
}

function validate<T>(value: T, validators: Validator<T>[]): ValidationContext<T> {
  const errors: string[] = [];

  for (const validator of validators) {
    const result = validator(value);
    if (result) errors.push(...result.errors);
  }

  return {
    value,
    errors,
  };
}

export function Validation<T>({ value, validators, children }: ValidationProps<T>) {
  const context = useMemo(() => validate(value, validators), [validators, value]);
  return <>{children(context)}</>;
}
