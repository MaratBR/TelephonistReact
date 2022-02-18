import React from 'react';
import { Centered } from '@ui/Layout';
import LoadingSpinner from '@ui/LoadingSpinner';
import Screen from '@ui/Screen';
import { useApi } from 'api/hooks';
import { observer } from 'mobx-react';
import { Navigate } from 'react-router-dom';
import { useGlobalState } from 'state/hooks';

function AppInitializationWrapper({ children }: React.PropsWithChildren<{}>) {
  const { auth } = useGlobalState();
  const api = useApi();

  if (!auth.isInitialized) {
    return (
      <Screen>
        <Centered>
          <LoadingSpinner size={2} />
        </Centered>
      </Screen>
    );
  }

  if (!auth.isAuthorized) {
    return <Navigate to={{ pathname: '/login', search: `next=${window.location.pathname}` }} />;
  }

  return (
    <>
      {/* eslint-ignore-line react/jsx-no-useless-fragment */}
      {children}
    </>
  );
}

export default observer(AppInitializationWrapper);
