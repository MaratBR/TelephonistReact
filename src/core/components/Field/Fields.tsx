import S from './Fields.module.scss';
import classNames from 'classnames';

type FieldsProps = React.HTMLAttributes<HTMLDivElement>;

function Fields({ className, ...props }: FieldsProps) {
  return <div className={classNames(S.fields, className)} {...props} />;
}

export default Fields;
