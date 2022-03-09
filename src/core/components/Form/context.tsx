import React, { useMemo, useState } from 'react';
import { ValueCallback, VoidCallback } from 'core/utils/types';

export interface FormControl {
  validate(callback?: ValueCallback<boolean>): void;
  reset(callback?: VoidCallback): void;
  flush(callback?: VoidCallback): void;
}

export interface FormControlsRegistry {
  add(control: FormControl): void;
  remove(control: FormControl): void;
}

export const FormControlsRegistryContext = React.createContext<FormControlsRegistry | null>(null);

export interface FormController {
  validate(callback?: ValueCallback<boolean>): void;
  reset(callback?: VoidCallback): void;
  flushAll(callback?: VoidCallback): void;
}

export const FormControllerContext = React.createContext<FormController | null>(null);

export interface FormStatus {
  isValid: boolean;
}

export const FormStatusContext = React.createContext<FormStatus | null>(null);

export function FormEnvironmentProvider({ children }: React.PropsWithChildren<{}>) {
  const [status, setStatus] = useState<FormStatus>({ isValid: true });

  const ctx = useMemo<FormControlsRegistry & FormController>(() => {
    const controls: FormControl[] = [];
    return {
      add: (control) => controls.push(control),
      remove: (control) => {
        const index = controls.indexOf(control);
        if (index !== -1) controls.splice(index, 1);
      },
      validate: (callback) => {
        let controlsLeft = controls.length;
        let isAllValid = true;
        const onControlValidated = (isValid: boolean) => {
          controlsLeft -= 1;
          isAllValid &&= isValid;
          if (controlsLeft === 0) {
            setStatus((v) => ({ ...v, isValid: isAllValid }));
            callback(isAllValid);
          }
        };
        for (const control of controls) {
          control.validate(callback ? onControlValidated : undefined);
        }
      },
      reset: (callback) => {
        const controlsLeft = controls.length;
        const onControlReset = () => {
          if (controlsLeft === 0) {
            callback();
          }
        };
        for (const control of controls) {
          control.reset(callback ? onControlReset : undefined);
        }
        setStatus((v) => ({ ...v, isValid: true }));
      },
      flushAll: (callback) => {
        const controlsLeft = controls.length;
        const onControlFlush = () => {
          if (controlsLeft === 0) {
            callback();
          }
        };
        for (const control of controls) {
          control.flush(callback ? onControlFlush : undefined);
        }
      },
    };
  }, []);

  return (
    <FormControlsRegistryContext.Provider value={ctx}>
      <FormControllerContext.Provider value={ctx}>
        <FormStatusContext.Provider value={status}>{children}</FormStatusContext.Provider>
      </FormControllerContext.Provider>
    </FormControlsRegistryContext.Provider>
  );
}
