import React from "react";
import { isTabPanel } from "./TabPanel";

type TabPanelsProps = {
  children?: React.ReactNode;
}

export default function TabPanels({ children }: TabPanelsProps) {
  let counter = 0;
  return (
    <>
      {
        React.Children.map(children, (child) => {
          if (!isTabPanel(child)) return child;
          return React.cloneElement(child, {
            // eslint-disable-next-line no-plusplus
            tabID: child.props.tabID ?? counter++,
          });
        })
      }
    </>
  );
}
