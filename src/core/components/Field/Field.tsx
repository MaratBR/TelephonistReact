import S from './Field.module.scss';

type FieldProps = React.PropsWithChildren<{
  name: string;
  description?: string;
}>;

export default function Field({ name, children, description }: FieldProps) {
  return (
    <div className={S.root}>
      <div className={S.head}>
        <span className={S.label}>{name}</span>
        <span>{description}</span>
      </div>
      <div className={S.body}>
        {children}
      </div>
    </div>
  );
}
