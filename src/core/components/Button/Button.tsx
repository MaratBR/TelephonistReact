import React from 'react';
import S from './Button.module.scss';
import { Interpolation, css } from '@emotion/react';
import classNames from 'classnames';
import LoadingSpinner from 'core/components/LoadingSpinner';
import { useColor } from 'core/components/theme';
import { NavLink, To } from 'react-router-dom';
import tinycolor, { Instance } from 'tinycolor2';

type ButtonVariant = 'ghost' | 'default' | 'outline' | 'link';

interface ButtonStyle {
  baseColor?: Instance;
  variant: ButtonVariant;
}
type StyledButtonProps = {
  _style: ButtonStyle;
} & JSX.IntrinsicElements['button'];

type ButtonLikeNavLinkProps = {
  _style: ButtonStyle;
  to: To;
} & JSX.IntrinsicElements['a'];

type ButtonComputedAttributes = {
  css?: Interpolation<any>;
  className: string;
};

function _attrs(className: string, _style: ButtonStyle): ButtonComputedAttributes {
  const arr = [className, S.button];

  if (_style.variant === 'link') {
    // link ignores the color
    arr.push(S.link);
    return {
      className: classNames(arr),
    };
  }

  if (_style.variant === 'default') {
    arr.push(_style.baseColor ? S.colored : S.default);
  } else {
    arr.push(S[_style.variant]);
  }

  return {
    className: arr.join(' '),
    css:
      _style.baseColor &&
      css({
        '--button-main-color': _style.baseColor.toString(),
        '--button-main-color-2': _style.baseColor.clone().darken().toString(),
        '--button-main-color-3': _style.baseColor.clone().lighten(7).toString(),
        '--button-disabled-color': tinycolor({
          ..._style.baseColor.clone().toHsl(),
          s: 30,
        })
          .lighten()
          .toString(),
        '--button-fg-color': _style.baseColor.isLight() ? 'black' : 'white',
      }),
  };
}

const StyledButton = React.forwardRef(
  (
    { _style, className, ...props }: StyledButtonProps,
    ref: React.ForwardedRef<HTMLButtonElement>
  ) => <button type="button" {..._attrs(className, _style)} {...props} ref={ref} />
);

const ButtonLikeNavLink = React.forwardRef(
  (
    { _style, to, children, className, ...props }: ButtonLikeNavLinkProps,
    ref: React.ForwardedRef<HTMLAnchorElement>
  ) => (
    <NavLink to={to} {..._attrs(className, _style)} role="button" {...props} ref={ref}>
      {children ?? ''}
    </NavLink>
  )
);

type ButtonOnlyProps = {
  children: React.ReactNode;
  color?: string;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  left?: React.ReactNode;
  right?: React.ReactNode;
  size?: 'sm';
};

type NavLinkButtonProps = ButtonOnlyProps & {
  to: To;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>;
type NormalButtonProps = ButtonOnlyProps & {
  to?: undefined;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;
export type ButtonProps = NormalButtonProps | NavLinkButtonProps;

interface ButtonContentProps {
  visible: boolean;
  children: React.ReactNode;
}

function ButtonContent({ children, visible }: ButtonContentProps) {
  return (
    <div style={{ opacity: visible ? 1 : 0 }} className={S.content}>
      {children}
    </div>
  );
}

const Button = React.forwardRef(
  (
    { variant, to, color, loading, children, left, right, ...props }: ButtonProps,
    ref?: React.ForwardedRef<HTMLAnchorElement & HTMLButtonElement>
  ) => {
    const inner = (
      <>
        {left ? <div className={S.aside}>{left}</div> : undefined}
        <ButtonContent visible={!loading}>{children}</ButtonContent>
        {right}
        {loading ? (
          <div className={S.loading}>
            <LoadingSpinner size={1} />
          </div>
        ) : null}
      </>
    );
    const baseColor = color ? useColor(color) : undefined;
    const style = {
      variant: variant ?? 'default',
      baseColor,
    };

    if (typeof to !== 'undefined') {
      return (
        <ButtonLikeNavLink
          to={to}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
          _style={style}
          ref={ref}
        >
          {inner}
        </ButtonLikeNavLink>
      );
    }

    return (
      <StyledButton
        {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
        _style={style}
        ref={ref}
      >
        {inner}
      </StyledButton>
    );
  }
);

export default React.memo(Button);
