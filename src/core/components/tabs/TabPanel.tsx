import { useContext, useEffect, useRef } from "react";
import { Context } from "./context";
import { isReactElement } from "./helpers";

interface TabPanelProps {
  children: React.ReactNode;
  tabID?: string | number;
}

function TabPanel({ children, tabID }: TabPanelProps) {
  const ctx = useContext(Context);
  if (ctx === null) throw new Error("TabsContext is missing");

  const beenRendered = useRef(false);
  const isSelected = tabID === ctx.selected;

  useEffect(() => {
    if (!beenRendered.current && isSelected) {
      beenRendered.current = true;
    }
  }, [ctx.selected]);

  if (
    (ctx.keepAlive === false && !isSelected)
    || (ctx.keepAlive === "lazy" && !beenRendered.current)
  ) return null;

  return (
    <div style={{ display: isSelected ? undefined : "none" }}>
      {children}
    </div>
  );
}

export function isTabPanel(o: any): o is React.ReactElement<TabPanelProps> {
  return isReactElement(o) && o.type === TabPanel;
}

export default TabPanel;
