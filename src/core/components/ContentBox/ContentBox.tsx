import classNames from 'classnames';
import { HTMLAttributes } from 'react';
import S from './ContentBox.module.scss';

function ContentBox(
  { className, ...props }: HTMLAttributes<HTMLDivElement>,
) {
  return (
    <div className={classNames(S.contentBox, className)} {...props} />
  );
}

export default ContentBox;
