import React, { useEffect, useRef, useState } from 'react';
import { combineListeners } from '@ui/utils';
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
  const [width, setWidth] = useState('auto');
  const ref = useRef<HTMLLIElement>();

  useEffect(() => {
    if (ref.current) {
      setWidth(`${ref.current.clientWidth + 12}px`);
    }
  }, [props.children, ref.current]);

  return (
    <li
      ref={ref}
      role="tab"
      onClick={combineListeners<[React.MouseEvent<HTMLLIElement>]>(() => {
        if (!disabled && onSelect) onSelect();
      }, onClick)}
      id={id}
      style={{ width }}
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
