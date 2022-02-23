import React, { useEffect } from 'react';
import { Centered } from '@coreui/Layout';
import LoadingSpinner from '@coreui/LoadingSpinner';
import { ModalProvider } from '@coreui/Modal';
import { ThemeProvider } from '@coreui/theme';
import GlobalAppNotifications from './GlobalAppNotifications';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import state from 'state';

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
  return <LazyComponent />;
}

function Root({ children }: React.PropsWithChildren<{}>) {
  return <React.Suspense fallback={<Loader />}>{children}</React.Suspense>;
}

const COMPONENTS = {
  LoginPage: lazy(() => import('pages/auth/LoginPage/LoginPage')),
  PasswordResetPage: lazy(() => import('pages/auth/PasswordResetPage')),
  AllApplications: lazy(() => import('pages/applications/AllApplications')),
  NewApplication: lazy(() => import('pages/applications/NewApplication')),
  ViewApplication: lazy(() => import('pages/applications/ViewApplication')),
  ViewApplicationTask: lazy(() => import('pages/tasks/ViewApplicationTask')),
  EditApplication: lazy(() => import('pages/applications/EditApplication')),
};

function AppRouter() {
  return (
    <React.Suspense fallback={loader}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={COMPONENTS.LoginPage} />
          <Route path="/login/password-reset" element={COMPONENTS.PasswordResetPage} />
          <Route path="/" element={lazy(() => import('pages/MainPage'))}>
            <Route path="applications" element={COMPONENTS.AllApplications} />
            <Route path="applications/new" element={COMPONENTS.NewApplication} />
            <Route path="applications/:id" element={COMPONENTS.ViewApplication} />
            <Route path="applications/:id/edit" element={COMPONENTS.EditApplication} />
            <Route path="tasks/:appName/:taskName" element={COMPONENTS.ViewApplicationTask} />
          </Route>
        </Routes>
      </BrowserRouter>
    </React.Suspense>
  );
}

export function App() {
  useEffect(() => {
    if (!state.isInitialized) state.initialize();
  }, []);

  return (
    <ThemeProvider>
      <Toaster />
      <ModalProvider>
        <Root>
          <GlobalAppNotifications />
          <AppRouter />
        </Root>
      </ModalProvider>
    </ThemeProvider>
  );
}
