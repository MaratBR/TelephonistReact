import React from 'react';

export interface TabsContext {
  selected: string | number;
  disabled: boolean;
  keepAlive?: boolean | 'lazy';
  select(id: string | number): void;
}

export const Context = React.createContext<TabsContext | null>(null);
