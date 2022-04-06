import React from 'react';
import { Centered } from '@ui/Layout';
import LoadingSpinner from '@ui/LoadingSpinner';
import { ModalProvider } from '@ui/Modal';
import { ThemeProvider } from '@ui/theme';
import GlobalAppNotifications from './GlobalAppNotifications';
import HomePage from '@admin/HomePage';
import { ApiProvider } from 'api/context';
import { UserHubProvider } from 'api/userHub/context';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from 'react-query';
import { createWebStoragePersistor } from 'react-query/createWebStoragePersistor-experimental';
import { ReactQueryDevtools } from 'react-query/devtools';
import { persistQueryClient } from 'react-query/persistQueryClient-experimental';
import { Provider as StoreProvider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import store from 'store';

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

  AllApplications: lazy(() => import('pages/admin/applications/AllApplications')),
  NewApplication: lazy(() => import('pages/admin/applications/NewApplication')),
  ViewApplication: lazy(() => import('pages/admin/applications/ViewApplication')),
  ViewApplicationTask: lazy(() => import('pages/admin/tasks/ViewApplicationTask')),
  SequenceView: lazy(() => import('pages/admin/sequence/SequenceView')),
  GenerateRegistrationCode: lazy(() => import('pages/admin/applications/GenerateRegistrationCode')),

  UsersList: lazy(() => import('pages/admin/users/UsersList')),
  UserView: lazy(() => import('pages/admin/users/UserView')),
  NewUser: lazy(() => import('pages/admin/users/NewUser')),
};

function AppRouter() {
  return (
    <React.Suspense fallback={loader}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={COMPONENTS.LoginPage} />
          <Route path="/login/password-reset" element={COMPONENTS.PasswordResetPage} />
          <Route path="/admin/" element={lazy(() => import('pages/admin/MainPage'))}>
            <Route path="" element={<HomePage />} />
            <Route path="applications" element={COMPONENTS.AllApplications} />
            <Route path="applications/new" element={COMPONENTS.NewApplication} />
            <Route path="applications/cr" element={COMPONENTS.GenerateRegistrationCode} />
            <Route path="applications/:id" element={COMPONENTS.ViewApplication} />
            <Route path="tasks/:appName/:taskName" element={COMPONENTS.ViewApplicationTask} />
            <Route path="sequences/:id" element={COMPONENTS.SequenceView} />

            <Route path="users" element={COMPONENTS.UsersList} />
            <Route path="users/new" element={COMPONENTS.NewUser} />
            <Route path="users/:name" element={COMPONENTS.UserView} />
          </Route>
        </Routes>
      </BrowserRouter>
    </React.Suspense>
  );
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 1000 * 20,
    },
  },
});

const localStoragePersistor = createWebStoragePersistor({ storage: window.localStorage });

persistQueryClient({
  queryClient,
  persistor: localStoragePersistor,
});

export function App() {
  return (
    <ThemeProvider>
      <Toaster />
      <QueryClientProvider client={queryClient}>
        <StoreProvider store={store}>
          <Root>
            <ApiProvider>
              <UserHubProvider>
                <ModalProvider>
                  <GlobalAppNotifications />
                  <AppRouter />
                </ModalProvider>
              </UserHubProvider>
            </ApiProvider>
          </Root>
        </StoreProvider>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
