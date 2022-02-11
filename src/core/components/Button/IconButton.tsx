import classNames from 'classnames';
import { ButtonHTMLAttributes } from 'react';
import S from './IconButton.module.scss';

export default function IconButton({
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type="button" className={classNames(className, S.button)} {...props} />;
}
