import { forwardRef } from 'react';
import S from './InputLayout.module.scss';
import classNames from 'classnames';

type InputLayoutVariant = 'inline' | 'top' | 'aside' | 'aside-right';
type DescriptionPosition = 'default' | 'nearInput';

interface InputLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: InputLayoutVariant;
  descriptionPos?: DescriptionPosition;
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
    descriptionPos,
    ...props
  }: InputLayoutProps) => {
    const descriptionNode = <span className={S.description}>{description}</span>;

    return (
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
          {descriptionPos !== 'nearInput' ? descriptionNode : undefined}
        </div>
        <div className={S.body}>
          {children}
          {descriptionPos === 'nearInput' ? descriptionNode : undefined}
        </div>
      </div>
    );
  }
);

export default InputLayout;
