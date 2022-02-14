import S from './Select.module.scss';
import classNames from 'classnames';

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export default function Select({ className, ...props }: SelectProps) {
  return <select className={classNames(S.select, className)} {...props} />;
}
