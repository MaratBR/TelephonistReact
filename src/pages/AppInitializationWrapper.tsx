import React from 'react';
import { Centered } from '@ui/Layout';
import LoadingSpinner from '@ui/LoadingSpinner';
import Screen from '@ui/Screen';
import { observer } from 'mobx-react';
import { Navigate } from 'react-router-dom';
import state from 'state';

function AppInitializationWrapper({ children }: React.PropsWithChildren<{}>) {
  if (!state.auth.isInitialized) {
    return (
      <Screen>
        <Centered>
          <LoadingSpinner size={2} />
        </Centered>
      </Screen>
    );
  }

  if (!state.auth.isAuthorized) {
    return (
      <Navigate
        to={{ pathname: '/login', search: `next=${window.location.pathname}` }}
      />
    );
  }

  return (
    <>
      {/* eslint-ignore-line react/jsx-no-useless-fragment */}
      {children}
    </>
  );
}

export default observer(AppInitializationWrapper);
