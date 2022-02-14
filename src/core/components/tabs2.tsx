import React, { useEffect } from 'react';
import * as tabs from 'react-tabs';
import { setHashQuery } from 'utils/hash';

interface TabsProps extends tabs.TabsProps {
  tabsID?: string;
}

function Tabs(
  { onSelect, tabsID, children, ...props }: TabsProps,
  ref: React.ForwardedRef<tabs.Tabs>
) {
  let onSelectCallback: typeof onSelect = onSelect;
  if (tabsID) {
    const hashKey = `tabs.${tabsID}`;
    if (typeof props.selectedIndex === 'undefined') {
      onSelectCallback = (index, last, event) => {
        setHashQuery({ [hashKey]: index });
        if (onSelect) onSelect(index, last, event);
      };
    } else {
      useEffect(() => {
        setHashQuery({ [hashKey]: props.selectedIndex });
      }, [props.selectedIndex]);
    }
  }
  return (
    <tabs.Tabs onSelect={onSelectCallback} {...props}>
      {children}
    </tabs.Tabs>
  );
}

const TabsComponent = React.forwardRef(Tabs);

export { TabsComponent as Tabs };
export const { TabPanel } = tabs;
export const { Tab } = tabs;
export const { TabList } = tabs;
