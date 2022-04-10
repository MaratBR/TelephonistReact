import React, { useMemo } from 'react';
import { Api } from './Api';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from 'store';
import { getMeta } from 'utils';

export interface ApiConfiguration {
  baseURL: string;
}

export const ApiInstanceContext = React.createContext<Api | null>(null);

export function getApiURL() {
  let metaApiUrl = getMeta('backend-api-url');

  if (process.env.NODE_ENV === 'development') {
    metaApiUrl = process.env.DEBUG_API_URL || 'http://locahost:5789';
  }

  let u: URL;
  try {
    try {
      u = new URL(metaApiUrl);
    } catch {
      if (!metaApiUrl.startsWith('/')) metaApiUrl = `/${metaApiUrl}`;
      metaApiUrl = window.location.origin + metaApiUrl;
      u = new URL(metaApiUrl);
    }
  } catch (e) {
    throw new Error(`invalid API URL: ${e.toString()}`);
  }
  return u;
}

export function ApiProvider({ children }: React.PropsWithChildren<{}>) {
  const csrfToken = useAppSelector((s) => s.auth.csrfToken);
  const { t } = useTranslation();

  const api = useMemo(
    () => new Api({ t, csrfToken, baseURL: `${getApiURL().toString()}api/user-v1` }),
    [csrfToken, t]
  );

  return <ApiInstanceContext.Provider value={api}>{children}</ApiInstanceContext.Provider>;
}
