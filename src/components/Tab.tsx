import React, { useEffect } from "react";
import * as tabs from "react-tabs";
import { setHashQuery, useHashValue } from "@/utils/hash";

interface TabsProps extends tabs.TabsProps {
  tabsID?: string;
}

export const Tabs = React.forwardRef(
  (
    { onSelect, tabsID, children, ...props }: TabsProps,
    ref: React.ForwardedRef<tabs.Tabs>
  ) => {
    if (tabsID) {
      const hashKey = "tabs." + tabsID;
      if (typeof props.selectedIndex === "undefined") {
        const old = onSelect;
        onSelect = (index, last, event) => {
          setHashQuery({ [hashKey]: index });
          if (old) old(index, last, event);
        };
      } else {
        useEffect(() => {
          setHashQuery({ [hashKey]: props.selectedIndex });
        }, [props.selectedIndex]);
      }
    }
    return (
      <tabs.Tabs onSelect={onSelect} {...props}>
        {children}
      </tabs.Tabs>
    );
  }
);

export const TabPanel = tabs.TabPanel;
export const Tab = tabs.Tab;
export const TabList = tabs.TabList;
