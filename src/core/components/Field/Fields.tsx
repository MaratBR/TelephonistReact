import classNames from 'classnames';
import S from './Fields.module.scss';

type FieldsProps = React.HTMLAttributes<HTMLDivElement>;

function Fields({ className, ...props }: FieldsProps) {
  return <div className={classNames(S.fields, className)} {...props} />;
}

export default Fields;
