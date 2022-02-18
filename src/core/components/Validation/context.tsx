import React, { useMemo } from 'react';

interface Validateable {
  reset(): void;
  validate(callback?: () => void): void;
  isValid: boolean;
  setValidatedCallback(callback: (valid: boolean) => void);
}

interface ValidationController {
  isValid: boolean;
  register(validateable: Validateable);
  unregister(validateable: Validateable);
}

export const ValidationContext = React.createContext<ValidationController | null>(null);

interface ValidationProviderProps {
  children?: React.ReactNode;
}

class ValidationControllerImpl implements ValidationController {
  isValid: boolean = true;

  private _validatables: Validateable[] = [];

  register(validateable: Validateable) {
    if (this._validatables.indexOf(validateable) !== -1) this._validatables.push(validateable);
  }

  unregister(validateable: Validateable) {
    const index = this._validatables.indexOf(validateable);
    if (index !== -1) this._validatables.splice(index, 1);
  }
}

export function ValidationProvider({ children }: ValidationProviderProps) {
  const context = useMemo(() => new ValidationControllerImpl(), []);

  return <ValidationContext.Provider value={context}>{children}</ValidationContext.Provider>;
}
