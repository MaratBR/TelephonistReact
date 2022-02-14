import { forwardRef } from 'react';
import S from './InputLayout.module.scss';
import classNames from 'classnames';

type InputLayoutVariant = 'inline' | 'top' | 'aside' | 'aside-right';

interface InputLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: InputLayoutVariant;
  inlineBlock?: boolean;
  header?: React.ReactNode;
  description?: React.ReactNode;
  id: string;
  isChanged?: boolean;
}

const variants: Record<InputLayoutVariant, string> = {
  inline: S.inline,
  'aside-right': `${S.aside} ${S.right}`,
  aside: S.aside,
  top: S.top,
};

const InputLayout = forwardRef(
  ({
    className,
    inlineBlock,
    children,
    header,
    description,
    variant,
    isChanged,
    id,
    ...props
  }: InputLayoutProps) => (
    <div
      className={classNames(S.layout, className, variants[variant ?? 'aside'], {
        [S.inlineBlock]: inlineBlock,
      })}
      {...props}
    >
      <div className={S.header}>
        <label htmlFor={id} className={S.label}>
          {header}
          {isChanged && <div className={S.changedDot} />}
        </label>
        <span className={S.description}>{description}</span>
      </div>
      <div className={S.body}>{children}</div>
    </div>
  )
);

export default InputLayout;
