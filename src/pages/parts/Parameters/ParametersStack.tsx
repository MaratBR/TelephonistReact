import S from './ParametersStack.module.scss';

type ParametersStackProps = {
  children?: React.ReactNode;
}

function ParametersStack({ children }: ParametersStackProps) {
  return (
    <div className={S.parametersStack}>
      {children}
    </div>
  );
}

export default ParametersStack;
