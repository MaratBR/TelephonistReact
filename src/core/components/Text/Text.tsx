import S from './Text.module.scss';

type TextType = 'hint';

interface TextProps {
  type?: TextType;
  children?: React.ReactNode;
}

export default function Text({ type, children }: TextProps) {
  return <span className={S[type]}>{children}</span>;
}
