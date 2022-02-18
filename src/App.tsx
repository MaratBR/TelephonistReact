import React from 'react';
import { Centered } from '@ui/Layout';
import LoadingSpinner from '@ui/LoadingSpinner';
import { ThemeProvider } from '@ui/theme';
import styled from '@emotion/styled';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function Loader() {
  return (
    <Centered>
      <LoadingSpinner size={2} />
    </Centered>
  );
}

const loader = <Loader />;

function lazy(component: () => Promise<any>) {
  const LazyComponent = React.lazy(component);
  return (
    <React.Suspense fallback={loader}>
      <LazyComponent />
    </React.Suspense>
  );
}

const Root = styled.div`
  height: 100vh;
`;

const COMPONENTS = {
  LoginPage: lazy(() => import('pages/LoginPage')),
  PasswordResetPage: lazy(() => import('pages/PasswordResetPage')),
  AllApplications: lazy(() => import('pages/AllApplications')),
  NewApplication: lazy(() => import('pages/NewApplication')),
  ViewApplication: lazy(() => import('pages/ViewApplication')),
  ViewApplicationTask: lazy(() => import('pages/ViewApplicationTask')),
  EditApplication: lazy(() => import('pages/EditApplication')),
};

function AppRouter() {
  return (
    <React.Suspense fallback={<Loader />}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={COMPONENTS.LoginPage} />
          <Route path="/login/password-reset" element={COMPONENTS.PasswordResetPage} />
          <Route path="/" element={lazy(() => import('pages/MainPage'))}>
            <Route path="applications" element={COMPONENTS.AllApplications} />
            <Route path="applications/new" element={COMPONENTS.NewApplication} />
            <Route path="applications/:id" element={COMPONENTS.ViewApplication} />
            <Route path="applications/:id/edit" element={COMPONENTS.EditApplication} />
            <Route
              path="applications/:appID/tasks/:taskID"
              element={COMPONENTS.ViewApplicationTask}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </React.Suspense>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <Toaster />
      <Root>
        <AppRouter />
      </Root>
    </ThemeProvider>
  );
}
