import classNames from "classnames";
import S from "./Select.module.scss";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export default function Select({ className, ...props }: SelectProps) {
  return <select className={classNames(S.select, className)} {...props} />;
}
