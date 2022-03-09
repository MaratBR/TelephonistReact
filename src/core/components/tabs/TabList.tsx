import React, { useContext } from 'react';
import { isTab } from './Tab';
import S from './TabList.module.scss';
import { Context } from './context';
import classNames from 'classnames';

type ControlledTabListProps = React.HTMLAttributes<HTMLUListElement> & {
  selected: string | number;
  onTabSelected: (id: string | number) => void;
  hidden: boolean;
};

export function ControlledTabList({
  children,
  selected,
  onTabSelected,
  hidden,
}: ControlledTabListProps) {
  let counter = 0;

  const mappedChildren = React.Children.map(children, (child) => {
    if (!isTab(child)) return child;
    // eslint-disable-next-line no-plusplus
    const id = child.props.tabID ?? counter++;
    return React.cloneElement(child, {
      selected: id === selected,
      onSelect: () => onTabSelected(id),
    });
  });

  return <div className={classNames(S.tabList, { [S.hidden]: hidden })}>{mappedChildren}</div>;
}

type TabListProps = { children?: React.ReactNode };

function TabList({ children }: TabListProps) {
  const ctx = useContext(Context);

  return (
    <ControlledTabList hidden={ctx.hidden} selected={ctx.selected} onTabSelected={ctx.select}>
      {children}
    </ControlledTabList>
  );
}

export default TabList;
