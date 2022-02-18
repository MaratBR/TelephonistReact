import React, { useContext } from 'react';
import { isTab } from './Tab';
import S from './TabList.module.scss';
import { Context } from './context';

type ControlledTabListProps = React.HTMLAttributes<HTMLUListElement> & {
  selected: string | number;
  onTabSelected: (id: string | number) => void;
};

export function ControlledTabList({ children, selected, onTabSelected }: ControlledTabListProps) {
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

  return <div className={S.tabList}>{mappedChildren}</div>;
}

type TabListProps = { children?: React.ReactNode };

function TabList({ children }: TabListProps) {
  const ctx = useContext(Context);

  return (
    <ControlledTabList selected={ctx.selected} onTabSelected={ctx.select}>
      {children}
    </ControlledTabList>
  );
}

export default TabList;
