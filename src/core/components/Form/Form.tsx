import { useState } from 'react';
import {
  FormEnvironmentProvider,
  FormStatus,
  FormStatusContext,
} from './context';
import { asPromise } from 'core/utils/async';

type FormProps = React.FormHTMLAttributes<HTMLFormElement> & {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
};

function preventDefault(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
}

export default function Form({ onSubmit, ...props }: FormProps) {
  const [status, setState] = useState<FormStatus>({
    isSubmitting: false,
    error: undefined,
  });
  const submitCallback: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    setState({ isSubmitting: true });
    asPromise(() => onSubmit(event))
      .then(() => setState({ isSubmitting: false }))
      .catch((error) => setState({ error, isSubmitting: false }));
  };

  return (
    <FormEnvironmentProvider>
      <FormStatusContext.Provider value={status}>
        <form onSubmit={submitCallback} {...props} />
      </FormStatusContext.Provider>
    </FormEnvironmentProvider>
  );
}
