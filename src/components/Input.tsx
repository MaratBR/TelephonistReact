import { css } from "@emotion/react";
import React, { useState } from "react";

export type InputVariant = "flushed" | "standard" | "plain" | "minimal";
type AnyInputProps = {
  variant?: InputVariant;
  isInvalid?: boolean;
};

type InputProps = AnyInputProps & JSX.IntrinsicElements["input"];

const inputConfigCSS = css`
  --input-color: var(--t-primary);
`;
const inputCSS = css`
  width: 100%;
  border: none;
  background: none;
  padding: var(--t-spacing-lg);
  font-size: 1em;
  outline: none;
  background-color: var(--t-paper);
  border-radius: var(--t-radius-sm);
  border: 2px solid var(--t-neutral-7);
  transition: border-color var(--t-transition-md);
  line-height: 1.2;

  &:focus {
    border-color: var(--input-color);
  }

  &:not(:placeholder-shown) + span {
    transform: translate(0, -140%) scale(0.8);
    background-color: var(--t-paper);
    color: var(--t-color);
  }
`;
const _css = css`
  position: relative;
  ${inputConfigCSS};

  & > input {
    ${inputCSS};
  }

  & > span {
    color: var(--t-neutral-4);
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    margin: calc(var(--t-spacing-lg) + 2px);
    line-height: 1.2;
    transition: transform var(--t-transition-sm);
    transform-origin: left top;
    pointer-events: none;
  }
`;

const invalidCSS = css`
  --input-color: var(--t-danger);
`;

const minimalCSS = css`
  & > input {
    border-width: 0 0 2px 0;
    border-radius: 0;
  }
  & > span {
    background-color: transparent !important;
    margin: var(--t-spacing-lg);
  }
  &::after {
    content: " ";
    background-color: var(--input-color);
    height: 1px;
    display: block;
    position: absolute;
    width: 100%;
    left: 0;
    top: 100%;
    transition: transform var(--t-transition-md);
    transform: scaleX(0);
  }
  &.focus::after,
  &[aria-invalid="true"]::after {
    transform: scaleX(1);
  }
`;
const variants = {
  flushed: css`
    ${minimalCSS};
    & > input {
      border-radius: var(--t-radius-sm) var(--t-radius-sm) 0 0;
      background-color: var(--t-neutral-9);
      border-width: 0 0 1px 0;
    }
  `,
  minimal: minimalCSS,
  standard: css``,
};

const Input = React.forwardRef(
  (
    { variant, placeholder, isInvalid, ...props }: InputProps,
    ref: React.ForwardedRef<HTMLInputElement>
  ) => {
    const [focus, setFocus] = useState<boolean>(false);
    return (
      <div
        role="textbox"
        aria-invalid={isInvalid ? "true" : "false"}
        className={focus ? "focus" : ""}
        css={[
          _css,
          isInvalid ? invalidCSS : undefined,
          variants[variant ?? "standard"],
        ]}
      >
        <input
          placeholder=" "
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          ref={ref}
          {...props}
        />
        <span>{placeholder}</span>
      </div>
    );
  }
);

export default Input;

type TextareaProps = AnyInputProps &
  React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const textareaCSS = css`
  ${inputCSS};
  ${inputConfigCSS};
  resize: vertical;
  min-height: 200px;
  font-family: var(--t-font-main);

  &::placeholder {
    color: var(--t-neutral-4);
  }
`;

export const Textarea = React.forwardRef(
  (
    { variant, isInvalid, ...props }: TextareaProps,
    ref: React.ForwardedRef<HTMLTextAreaElement>
  ) => {
    return (
      <textarea
        {...props}
        aria-invalid={isInvalid ? "true" : "false"}
        css={[textareaCSS, isInvalid ? invalidCSS : undefined]}
        ref={ref}
      />
    );
  }
);

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export function Select(props: SelectProps) {
  return <select css={inputCSS} {...props} />;
}
