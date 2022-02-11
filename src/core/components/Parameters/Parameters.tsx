import { Field, Fields } from '@cc/Field';
import React from 'react';

export default function Parameters({
  parameters,
}: {
  parameters: Record<string, React.ReactNode>;
}) {
  return (
    <Fields>
      {Object.entries(parameters).map((kv) => (
        <Field key={kv[0]} name={kv[0]}>
          {kv[1]}
        </Field>
      ))}
    </Fields>
  );
}