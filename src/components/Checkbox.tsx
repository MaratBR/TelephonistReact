import { css } from "@emotion/react";
import React, { ForwardedRef, useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { mdiCheck, mdiMinus, mdiTilde } from "@mdi/js";
import Icon from "@mdi/react";

const mkSvgDataUrl = (v, color?) =>
  `'data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="${v}" fill="${
    color ?? "currentColor"
  }"></path></svg>'`;

const checkboxRootCSS = css`
  height: 1.6em;
  width: 1.6em;
  display: inline-flex;
  position: relative;

  --checkbox-color-bg: var(--t-neutral-8);
  --checkbox-color-fg: var(--t-color);
  --checkbox-color-border: var(--t-neutral-8);

  &::after {
    content: "";
    display: block;
    height: 1px;
    width: 1px;
    left: 0.8em;
    top: 0.8em;
    border-radius: 100px;
    position: absolute;
    transition: box-shadow var(--t-transition-sm);
  }

  &:hover::after {
    box-shadow: 0 0 0 1.3em var(--t-primary-t10);
  }

  &:hover {
    --checkbox-color-border: var(--t-neutral-3);
  }

  &:active::after {
    box-shadow: 0 0 0 1.2em var(--t-primary-t20);
  }

  &[data-checked="true"] {
    --checkbox-color-bg: var(--t-primary);
    --checkbox-color-fg: var(--t-on-primary);
    --checkbox-color-border: var(--checkbox-color-bg);
  }
`;

const checkboxIconCSS = css`
  background-color: var(--checkbox-color-bg);
  border-radius: var(--t-radius-sm);
  inset: 0.1em;
  position: absolute;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  color: var(--checkbox-color-fg);
  border: 0.15em solid var(--checkbox-color-border);
`;

const css_ = css`
  height: 100%;
  width: 100%;
  opacity: 0;
  position: absolute;
  left: 0;
  top: 0;
  cursor: pointer;
`;

type ControlledCheckboxProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "checked" | "intermidiate"
> & { checked?: boolean; indeterminate?: boolean };

const ControlledCheckbox = React.forwardRef(
  (
    { indeterminate, checked, ...props }: ControlledCheckboxProps,
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const localRef = useRef<HTMLInputElement>();

    useEffect(() => {
      if (localRef.current) localRef.current.indeterminate = indeterminate;
    }, [indeterminate]);

    const [checkedState, setChecked] = useState(props.defaultChecked ?? false);

    if (typeof checked === "undefined") {
      checked = checkedState;
      const { onChange } = props;
      if (onChange) {
        props.onChange = (event) => {
          setChecked(event.target.checked);
          onChange(event);
        };
      } else {
        props.onChange = (event) => setChecked(event.target.checked);
      }
    }

    return (
      <span css={checkboxRootCSS} role="checkbox" data-checked={checked}>
        <div css={checkboxIconCSS}>
          {checked !== false || indeterminate ? (
            <Icon size={1} path={indeterminate ? mdiMinus : mdiCheck} />
          ) : undefined}
        </div>
        <input
          css={css_}
          data-indeterminate={indeterminate}
          ref={(value) => {
            localRef.current = value;
            if (ref) {
              if (typeof ref === "object") ref.current = value;
              else ref(value);
            }
          }}
          type="checkbox"
          checked={checked}
          {...props}
        />
      </span>
    );
  }
);

export default ControlledCheckbox;
