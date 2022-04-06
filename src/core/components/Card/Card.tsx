import S from './Card.module.scss';

interface CardProps {
  children?: React.ReactNode;
}

export default function Card({ children }: CardProps) {
  return <div className={S.card}>{children}</div>;
}
