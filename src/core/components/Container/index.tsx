import S from './index.module.scss';
import classNames from 'classnames';

interface ContainerProps {
  padded?: boolean;
  children?: React.ReactNode;
}

export default function Container({ children, padded }: ContainerProps) {
  return <div className={classNames(S.container, { [S.padded]: padded })}>{children}</div>;
}
