import { css, SerializedStyles } from "@emotion/react";
import React from "react";
import { Instance } from "tinycolor2";
import { useColor } from "~src/components/theme";
import styled from "@emotion/styled";
import { NavLink, To } from "react-router-dom";

type ButtonVariant = "ghost" | "solid" | "outline" | "link";
interface ButtonStyle {
  baseColor?: Instance;
  variant?: ButtonVariant;
}
type StyledButtonProps = {
  _style: ButtonStyle;
} & JSX.IntrinsicElements["button"];
type ButtonLikeNavLinkProps = {
  _style: ButtonStyle;
  to: To;
} & JSX.IntrinsicElements["a"];

const commonCSS = css`
  padding: var(--t-spacing-md);
`;

const solidCSS = css`
  ${commonCSS}
  background-color: var(--button-bg);
  &:hover {
    background-color: var(--button-bg2);
  }
  &:active {
    background-color: var(--button-bg3);
  }
  &:disabled {
    cursor: not-allowed;
    background-color: var(--t-neutral-5);
  }
  &:focus {
    box-shadow: 0 0 0 3px var(--button-bg3a);
  }
`;

const linkButtonCSS = css`
  background: none;
  padding: 0;
  color: var(--t-primary);
  &:hover {
    color: var(--t-color);
  }
  &:focus {
    box-shadow: 0 0 0 2px var(--t-primary-t20);
  }
  &:active {
    box-shadow: 0 0 0 2px var(--t-primary-t70);
  }
`;

const variants = {
  link: linkButtonCSS,
  solid: solidCSS,
};

const makeButtonStyles = (props: ButtonStyle) => {
  const c: SerializedStyles[] = [
    css`
      all: initial;
      display: flex;
      justify-content: center;
      font-family: var(--t-font-main);
      border: none;
      padding: var(--t-spacing-md) var(--t-spacing-md);
      border-radius: var(--t-radius-sm);
      cursor: pointer;
      transition: var(--t-transition-sm);
      box-sizing: border-box;
      position: relative;
      background-color: var(--button-bg);
      color: var(--button-fg);
    `,
  ];

  if (props.baseColor) {
    c.push(css`
      --button-bg: ${props.baseColor.toString()};
      --button-bg2: ${props.baseColor.clone().darken().toString()};
      --button-bg3: ${props.baseColor.clone().darken(20).toString()};
      --button-bg3a: ${props.baseColor.clone().setAlpha(0.5).toString()};
      --button-fg: ${props.baseColor.isLight() ? "black" : "white"};
    `);
  } else {
    c.push(css`
      --button-bg: var(--t-neutral-8);
      --button-bg2: var(--t-neutral-9);
      --button-bg3: var(--t-neutral-8);
      --button-fg: var(--t-color);
    `);
  }

  const variant = props.variant || "solid";
  c.push(variants[variant]);

  return c;
};

const StyledButton = React.forwardRef(
  (
    { _style, ...props }: StyledButtonProps,
    ref: React.ForwardedRef<HTMLButtonElement>
  ) => {
    return <button css={makeButtonStyles(_style)} {...props} ref={ref} />;
  }
);

const ButtonLikeNavLink = React.forwardRef(
  (
    { _style, children, ...props }: ButtonLikeNavLinkProps,
    ref: React.ForwardedRef<HTMLAnchorElement>
  ) => {
    return (
      <NavLink
        role="button"
        css={[makeButtonStyles(_style)]}
        {...props}
        ref={ref}
      >
        {children ?? ""}
      </NavLink>
    );
  }
);

type ButtonOnlyProps = {
  children: React.ReactNode;
  color?: string;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  left?: React.ReactNode;
  right?: React.ReactNode;
};
type NavLinkButtonProps = ButtonOnlyProps & {
  to: To;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>;
type NormalButtonProps = ButtonOnlyProps & {
  to?: undefined;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;
type ButtonProps = NormalButtonProps | NavLinkButtonProps;

const loadingCSS = css`
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  animation: spin linear 1s infinite;
  position: absolute;
  margin: auto;
  inset: 0;
`;

const ButtonContent = styled.div<{ visible: boolean }>`
  opacity: ${(props) => (props.visible ? 1 : 0)};
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  & > :not(:first-child) {
    margin-left: var(--t-spacing-md);
  }
`;

const Button = React.forwardRef(
  (
    {
      variant,
      to,
      color,
      loading,
      children,
      left,
      right,
      ...props
    }: ButtonProps,
    ref?: React.ForwardedRef<HTMLAnchorElement & HTMLButtonElement>
  ) => {
    children = (
      <>
        <ButtonWrapper>
          {left}
          <ButtonContent visible={!loading}>{children}</ButtonContent>
          {right}
        </ButtonWrapper>
        {loading ? <div css={loadingCSS} className="fa" /> : null}
      </>
    );
    const baseColor = color ? useColor(color) : undefined;
    const style = {
      variant,
      baseColor,
    };

    if (typeof to !== "undefined") {
      return (
        <ButtonLikeNavLink
          to={to}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
          _style={style}
          ref={ref}
        >
          {children}
        </ButtonLikeNavLink>
      );
    }

    return (
      <StyledButton
        {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
        _style={style}
        ref={ref}
      >
        {children}
      </StyledButton>
    );
  }
);

export default React.memo(Button);

const iconButtonCSS = css`
  border: none;
  background: none;
  border-radius: 100px;
`;

export const IconButton = styled.button`
  border: none;
  background: none;
  border-radius: 100px;
  &:hover {
    background-color: var(--t-highlight);
  }
`;
