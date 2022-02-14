import React, { useContext } from 'react';
import { Container } from 'inversify';

const DiContext = React.createContext<Container | null>(null);

export function useContainer() {
  return useContext(DiContext);
}

export function DiProvider({
  children,
  container,
}: React.PropsWithChildren<{ container: Container }>) {
  return <DiContext.Provider value={container}>{children}</DiContext.Provider>;
}

export type WithContainerParams = { diContainer: Container | null };

export function withContainer<P, S>(
  Component:
    | React.FC<P & { diContainer: Container | null }>
    | React.ComponentClass<P & WithContainerParams>
): React.FC<P> {
  const container = useContainer();
  return function (props) {
    return <Component diContainer={container} {...props} />;
  };
}
