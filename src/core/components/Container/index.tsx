import S from './index.module.scss';

interface ContainerProps {
  children?: React.ReactNode;
}

export default function Container({ children }: ContainerProps) {
  return <div className={S.container}>{children}</div>;
}
