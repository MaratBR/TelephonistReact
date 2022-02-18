import S from './InputErrors.module.scss';

interface InputErrorsProps {
  errors: string[];
}

export default function InputErrors({ errors }: InputErrorsProps) {
  if (errors.length === 0) return null;
  return (
    <div className={S.errors}>
      {errors[0]}
      {errors.length > 1 ? <span className={S.tag}>+{errors.length - 1}</span> : undefined}
    </div>
  );
}
