import S from './index.module.scss';
import classNames from 'classnames';

interface ValueCardProps {
  value: React.ReactNode;
  name: string;
  type?: 'danger';
}

export default function ValueCard({ value, name, type }: ValueCardProps) {
  return (
    <div className={classNames(S.root, S[type])}>
      <div className={S.value}>{value}</div>
      <span className={S.name}>{name}</span>
    </div>
  );
}
