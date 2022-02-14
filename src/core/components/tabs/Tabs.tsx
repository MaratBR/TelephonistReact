import React, { useCallback, useMemo, useState } from "react";
import { Context } from "./context";

type TabsProps = React.PropsWithChildren<{
  disabled?: boolean;
  keepAlive?: boolean | "lazy";
}>

export default function Tabs({ children, keepAlive, disabled }: TabsProps) {
  const [selected, select] = useState<string | number>(0);
  const ctx = useMemo(() => ({
    selected,
    select,
    disabled,
    keepAlive,
  }), [selected, disabled]);

  return (
    <Context.Provider value={ctx}>
      {children}
    </Context.Provider>
  );
}
