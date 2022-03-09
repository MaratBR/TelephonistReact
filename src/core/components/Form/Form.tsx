import React, { useState } from 'react';
import { FormEnvironmentProvider } from './context';
import { asPromise } from 'core/utils/async';

type FormProps = React.FormHTMLAttributes<HTMLFormElement> & {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
};

export interface FormState {
  isSubmitting: boolean;
  error?: any;
}

export const FormStateContext = React.createContext<FormState>({ isSubmitting: false });

export default function Form({ onSubmit, ...props }: FormProps) {
  const [state, setState] = useState<FormState>({ isSubmitting: false });
  const submitCallback: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    setState({ ...state, isSubmitting: true });
    asPromise(() => onSubmit(event))
      .then(() => setState({ isSubmitting: false, error: undefined }))
      .catch((error) => setState({ error, isSubmitting: false }));
  };

  return (
    <FormEnvironmentProvider>
      <FormStateContext.Provider value={state}>
        <form onSubmit={submitCallback} {...props} />
      </FormStateContext.Provider>
    </FormEnvironmentProvider>
  );
}
