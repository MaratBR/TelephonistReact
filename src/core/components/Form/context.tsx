import React, { useState } from 'react';

type ValidateCallback = (valid: boolean) => void;
type VoidCallback = () => void;

export interface FormControl {
  validate(callback?: ValidateCallback): void;
  reset(callback?: VoidCallback): void;
  setOnValidateCallback(callback: ValidateCallback): void;
}

export interface FormEnvironment {
  readonly canBeSubmitted: boolean;
  readonly isValid: boolean;
  readonly isValidated: boolean;
  add(control: FormControl): void;
  remove(control: FormControl): void;
  validate(callback?: ValidateCallback): void;
  reset(callback?: VoidCallback): void;
}

const Context = React.createContext<FormEnvironment | null>(null);

class FormEnvironmentImpl implements FormEnvironment {
  private _controls: FormControl[] = [];

  get canBeSubmitted() {
    return this.isValid;
  }

  isValid: boolean = true;

  isValidated: boolean = false;

  add(control: FormControl): void {
    if (this._controls.some((c) => c === control)) return;
    this._controls.push(control);
  }

  remove(control: FormControl): void {
    const index = this._controls.indexOf(control);
    if (index !== -1) this._controls.splice(index, 1);
  }

  reset(callback?: VoidCallback): void {
    let count = this._controls.length;
    if (count === 0) {
      if (callback) callback();
      return;
    }

    const onReset = () => {
      count -= 1;
      if (count === 0 && callback) callback();
    };

    for (const control of this._controls) {
      control.reset(onReset);
    }
  }

  validate(callback?: ValidateCallback): void {
    let valid = true;
    let count = this._controls.length;
    if (count === 0) {
      if (callback) callback(true);
      return;
    }

    const onValidated: ValidateCallback = (controlValid) => {
      valid &&= controlValid;
      count -= 1;
      if (count === 0 && callback) callback(valid);
    };

    for (const control of this._controls) {
      control.validate(onValidated);
    }
  }
}

function FormEnvironmentProvider({ children }: React.PropsWithChildren<{}>) {
  const [context] = useState(() => new FormEnvironmentImpl());

  return <Context.Provider value={context}>{children}</Context.Provider>;
}

export interface FormStatus {
  isSubmitting: boolean;
  error?: any;
}

const FormStatusContext = React.createContext<FormStatus>({
  isSubmitting: false,
});

export {
  FormEnvironmentProvider,
  Context as FormEnvironmentContext,
  FormStatusContext,
};
