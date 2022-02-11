import classNames from 'classnames';
import React from 'react';
import S from './Table.module.scss';

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  minimal?: boolean;
  hasFooter?: boolean;
}

function Table({
  className,
  minimal,
  hasFooter,
  ...props
}: TableProps) {
  return (
    <table
      className={classNames(className, S.table, {
        [S.hasFooter]: hasFooter,
        [S.minimal]: minimal,
      })}
      {...props}
    />
  );
}

export default Table;
