import { css, Interpolation, SerializedStyles } from "@emotion/react";
import React from "react";
import { Instance } from "tinycolor2";
import { useColor } from "@components/theme";
import styled from "@emotion/styled";
import { NavLink, To } from "react-router-dom";
import cn from "classnames"
import S from "./Button.module.scss"
import LoadingSpinner from "../LoadingSpinner";

type ButtonVariant = "ghost" | "default" | "outline" | "link";

interface ButtonStyle {
  baseColor?: Instance;
  variant: ButtonVariant;
}
type StyledButtonProps = {
  _style: ButtonStyle;
} & JSX.IntrinsicElements["button"];

type ButtonLikeNavLinkProps = {
  _style: ButtonStyle;
  to: To;
} & JSX.IntrinsicElements["a"];

type ButtonComputedAttributes = {
  css?: Interpolation<any>
  className: string
}

function _attrs(className: string, _style: ButtonStyle): ButtonComputedAttributes {
  const arr = [
    className, 
    S.button,
  ]
  
  if (_style.variant == "link") {
    // link ignores the color
    arr.push(S.link)
    return {
      className: cn(arr)
    }
  }
  
  if (_style.variant == "default") {
    arr.push(_style.baseColor ? S.colored : S.default)
  } else {
    arr.push(S[_style.variant])
  }

  className = arr.join(" ")

  return {
    className,
    css: _style.baseColor && css({
      "--button-main-color": _style.baseColor.toString(),
      "--button-main-color-2": _style.baseColor.clone().darken().toString(),
      "--button-main-color-3": _style.baseColor.clone().lighten(7).toString(),
      "--button-fg-color": _style.baseColor.isLight() ? "black" : "white"
    })
  }
}

const StyledButton = React.forwardRef(
  (
    { _style, className, ...props }: StyledButtonProps,
    ref: React.ForwardedRef<HTMLButtonElement>
  ) => {
    return <button {..._attrs(className, _style)} {...props} ref={ref} />;
  }
);

const ButtonLikeNavLink = React.forwardRef(
  (
    { _style, children, className, ...props }: ButtonLikeNavLinkProps,
    ref: React.ForwardedRef<HTMLAnchorElement>
  ) => {
    return (
      <NavLink
        {..._attrs(className, _style)}
        role="button"
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
  size?: string
};

type NavLinkButtonProps = ButtonOnlyProps & {
  to: To;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>;
type NormalButtonProps = ButtonOnlyProps & {
  to?: undefined;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;
export type ButtonProps = NormalButtonProps | NavLinkButtonProps;

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
        {left}
        <ButtonContent visible={!loading}>{children}</ButtonContent>
        {right}
        {loading ? <div className={S.loading}>
          <LoadingSpinner size={1} />
        </div> : null}
      </>
    );
    const baseColor = color ? useColor(color) : undefined;
    const style = {
      variant: variant ?? "default",
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

export const IconButton = styled.button`
  height: 3.5em;
  width: 3.5em;

  border: none;
  background: none;
  border-radius: 100px;
  &:hover {
    background-color: var(--t-highlight);
  }
`;
