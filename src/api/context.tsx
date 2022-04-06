import React, { useMemo } from 'react';
import { Api } from './Api';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from 'store';
import { getMeta } from 'utils';

export interface ApiConfiguration {
  baseURL: string;
}

export const ApiInstanceContext = React.createContext<Api | null>(null);

let metaApiUrl = getMeta('backend-api-url');

if (process.env.NODE_ENV === 'development') {
  metaApiUrl = process.env.DEBUG_API_URL || 'locahost:5789';
}

if (metaApiUrl.endsWith('/')) metaApiUrl = metaApiUrl.substring(0, metaApiUrl.length - 1);

export function ApiProvider({ children }: React.PropsWithChildren<{}>) {
  const csrfToken = useAppSelector((s) => s.auth.csrfToken);
  const { t } = useTranslation();

  const api = useMemo(
    () => new Api({ t, csrfToken, baseURL: `${metaApiUrl}/api/user-v1` }),
    [csrfToken, t]
  );

  return <ApiInstanceContext.Provider value={api}>{children}</ApiInstanceContext.Provider>;
}
