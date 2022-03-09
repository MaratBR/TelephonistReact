import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Context } from './context';
import { useSearchParams } from 'react-router-dom';

type TabsProps = React.PropsWithChildren<{
  disabled?: boolean;
  keepAlive?: boolean | 'lazy';
  id?: string;
  hidden?: boolean;
}>;

function getSelected(search: URLSearchParams, id: string): string | number {
  const value = search.get(`t.${id}`);
  if (value) {
    if (value.charAt(0) === '_') {
      const index = +value.substring(1);
      if (Number.isNaN(index) || index < 0) return 0;
      return index;
    }

    if (value === '') return 0;
    return value;
  }
  return 0;
}

export default function Tabs({ children, keepAlive, disabled, id, hidden }: TabsProps) {
  const [search, modifySearch] = useSearchParams();
  const [selected, setSelected] = useState<string | number>(() =>
    id ? getSelected(search, id) : 0
  );

  const select = useCallback(
    (v: string | number) => {
      setSelected(v);
      if (id) {
        search.set(`t.${id}`, typeof v === 'number' ? `_${v}` : v);
        modifySearch(search);
      }
    },
    [search, id]
  );

  useEffect(() => {
    if (id) {
      const s = getSelected(search, id);
      if (s !== selected) setSelected(s);
    }
  }, [search]);

  const ctx = useMemo(
    () => ({
      selected,
      select,
      disabled: disabled ?? false,
      keepAlive: keepAlive ?? false,
      hidden: hidden ?? false,
    }),
    [selected, keepAlive, disabled, hidden ?? false]
  );

  return <Context.Provider value={ctx}>{children}</Context.Provider>;
}
