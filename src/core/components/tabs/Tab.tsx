import React from 'react';
import { combineListeners } from '@coreui/utils';
import S from './Tab.module.scss';
import { isReactElement } from './helpers';
import classNames from 'classnames';

interface TabProps extends React.LiHTMLAttributes<HTMLLIElement> {
  selected?: boolean;
  disabled?: boolean;
  onSelect?: () => void;
  tabID?: string;
}

export default function Tab({
  id,
  onSelect,
  onClick,
  disabled,
  selected,
  className,
  ...props
}: TabProps) {
  return (
    <li
      role="tab"
      onClick={combineListeners(() => {
        if (!disabled && onSelect) onSelect();
      }, onClick)}
      id={id}
      className={classNames(className, S.tab, {
        [S.disabled]: disabled,
        [S.selected]: selected,
      })}
      {...props}
    />
  );
}

export function isTab(value: any): value is React.ReactElement<TabProps> {
  return isReactElement(value) && value.type === Tab;
}
