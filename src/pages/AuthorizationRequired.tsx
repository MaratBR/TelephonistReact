import React from 'react';
import { Centered } from '@coreui/Layout';
import LoadingSpinner from '@coreui/LoadingSpinner';
import Screen from '@coreui/Screen';
import { observer } from 'mobx-react';
import { Navigate } from 'react-router-dom';
import { useGlobalState } from 'state/hooks';

function AuthorizatioRequired({ children }: React.PropsWithChildren<{}>) {
  const state = useGlobalState();

  if (!state.isInitialized) {
    return (
      <Screen>
        <Centered>
          <LoadingSpinner size={2} />
        </Centered>
      </Screen>
    );
  }

  if (!state.auth.isAuthorized) {
    return <Navigate to={{ pathname: '/login', search: `next=${window.location.pathname}` }} />;
  }

  return (
    <>
      {/* eslint-ignore-line react/jsx-no-useless-fragment */}
      {children}
    </>
  );
}

export default observer(AuthorizatioRequired);
