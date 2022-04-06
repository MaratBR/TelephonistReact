import React, { useEffect } from 'react';
import { Centered } from '@ui/Layout';
import LoadingSpinner from '@ui/LoadingSpinner';
import Screen from '@ui/Screen';
import { useApi } from 'hooks';
import { Navigate } from 'react-router-dom';
import { initializeAuthThunk } from 'reducers/authReducer';
import { useAppDispatch, useAppSelector } from 'store';

function AuthorizatioRequired({ children }: React.PropsWithChildren<{}>) {
  const { isInitialized, isLoggedIn } = useAppSelector(({ auth }) => ({
    isInitialized: auth.isInitialized,
    isLoggedIn: auth.isLoggedIn,
  }));
  const dispatch = useAppDispatch();
  const { auth } = useApi();

  useEffect(() => {
    if (!isInitialized) {
      dispatch(initializeAuthThunk({ authAPI: auth }));
    }
  }, [isInitialized]);

  if (!isInitialized) {
    return (
      <Screen>
        <Centered>
          <LoadingSpinner size={2} />
        </Centered>
      </Screen>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to={{ pathname: '/login', search: `next=${window.location.pathname}` }} />;
  }

  return (
    <>
      {/* eslint-ignore-line react/jsx-no-useless-fragment */}
      {children}
    </>
  );
}

export default AuthorizatioRequired;
