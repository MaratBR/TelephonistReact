import React, { useCallback, useMemo, useState } from 'react';
import S from './index.module.scss';

interface SelectableTagProps extends React.InputHTMLAttributes<HTMLInputElement> {
  children?: React.ReactNode;
  checked?: boolean;
  id?: string;
}

export default function SelectableTag({ children, onChange, id, checked }: SelectableTagProps) {
  const inputID = useMemo(() => id ?? Math.random().toString(36).substring(2), [id]);
  const [checkedState, setCheckedState] = useState(checked);

  const isTrulyChecked = checked ?? checkedState;

  const onChangeCallback = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setCheckedState(event.target.checked);
      if (onChange) onChange(event);
    },
    [onChange]
  );

  return (
    <label className={isTrulyChecked ? `${S.tag} ${S.checked}` : S.tag} htmlFor={inputID}>
      {children}
      <input checked={isTrulyChecked} onChange={onChangeCallback} type="checkbox" id={inputID} />
    </label>
  );
}
