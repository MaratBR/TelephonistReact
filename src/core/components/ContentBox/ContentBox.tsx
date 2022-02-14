import { HTMLAttributes } from 'react';
import S from './ContentBox.module.scss';
import classNames from 'classnames';

type ContentBoxProps = HTMLAttributes<HTMLDivElement> & {
  padded?: boolean;
};

function ContentBox({ className, padded, ...props }: ContentBoxProps) {
  return (
    <div
      className={classNames(S.contentBox, className, { [S.padded]: padded })}
      {...props}
    />
  );
}

export default ContentBox;
