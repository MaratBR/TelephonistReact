import React, { ForwardedRef, useEffect, useRef, useState } from 'react';
import { combineRefs } from '@ui/utils';
import S from './Checkbox.module.scss';
import { mdiCheck, mdiMinus } from '@mdi/js';
import Icon from '@mdi/react';

type ControlledCheckboxProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type' | 'checked' | 'intermidiate'
> & { checked?: boolean; indeterminate?: boolean };

const ControlledCheckbox = React.forwardRef(
  (
    { indeterminate, checked, onChange, ...props }: ControlledCheckboxProps,
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const localRef = useRef<HTMLInputElement>();

    useEffect(() => {
      if (localRef.current) localRef.current.indeterminate = indeterminate;
    }, [indeterminate]);

    const [checkedState, setChecked] = useState(props.defaultChecked ?? false);
    const isChecked = checked ?? checkedState;
    let onChangeCallback = onChange;

    if (typeof checked === 'undefined') {
      if (onChange) {
        onChangeCallback = (event) => {
          setChecked(event.target.checked);
          onChange(event);
        };
      } else {
        onChangeCallback = (event) => setChecked(event.target.checked);
      }
    }

    return (
      <span className={S.root} role="checkbox" aria-checked={isChecked}>
        <div className={S.icon}>
          {isChecked !== false || indeterminate ? (
            <Icon size={1} path={indeterminate ? mdiMinus : mdiCheck} />
          ) : undefined}
        </div>
        <input
          onChange={onChangeCallback}
          className={S.checkbox}
          data-indeterminate={indeterminate}
          ref={combineRefs(localRef, ref)}
          type="checkbox"
          checked={isChecked}
          {...props}
        />
      </span>
    );
  }
);

export default ControlledCheckbox;
