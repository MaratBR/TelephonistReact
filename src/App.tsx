import React from 'react';
import { Centered } from '@ui/Layout';
import LoadingSpinner from '@ui/LoadingSpinner';
import { ModalProvider } from '@ui/Modal';
import { ThemeProvider } from '@ui/theme';
import GlobalAppNotifications from './GlobalAppNotifications';
import HomePage from '@admin/HomePage';
import Application from '@admin/applications/Application';
import ConnectionView from '@admin/connections/ConnectionView';
import LogsViewer from '@admin/logs/LogsViewer';
import SequenceListView from '@admin/sequence/SequenceListView';
import SequenceView from '@admin/sequence/SequenceView/SequenceView';
import { ApiProvider } from 'api/context';
import { UserHubProvider } from 'api/userHub/context';
import AllApplications from 'pages/admin/applications/AllApplications';
import GenerateRegistrationCode from 'pages/admin/applications/GenerateRegistrationCode';
import NewApplication from 'pages/admin/applications/NewApplication';
import ApplicationTask from 'pages/admin/tasks/ApplicationTask';
import NewUser from 'pages/admin/users/NewUser';
import UserView from 'pages/admin/users/UserView';
import UsersList from 'pages/admin/users/UsersList';
import LoginPage from 'pages/auth/LoginPage';
import PasswordResetPage from 'pages/auth/PasswordResetPage';
import Settings from 'pages/profile/Settings';
import About from 'pages/telephonist/About';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from 'react-query';
import { createWebStoragePersistor } from 'react-query/createWebStoragePersistor-experimental';
import { ReactQueryDevtools } from 'react-query/devtools';
import { persistQueryClient } from 'react-query/persistQueryClient-experimental';
import { Provider as StoreProvider } from 'react-redux';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
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

function AppRouter() {
  return (
    <React.Suspense fallback={loader}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/login/password-reset" element={<PasswordResetPage />} />
          <Route path="/telephonist/about" element={<About />} />
          <Route path="/admin/" element={lazy(() => import('pages/admin/MainPage'))}>
            <Route path="" element={<HomePage />} />
            <Route path="profile" element={<Settings />} />
            <Route path="applications" element={<AllApplications />} />
            <Route path="applications/new" element={<NewApplication />} />
            <Route path="applications/cr" element={<GenerateRegistrationCode />} />
            <Route path="applications/:id" element={<Application />} />
            <Route path="tasks/:appName/:taskName" element={<ApplicationTask />} />
            <Route path="sequences" element={<SequenceListView />} />
            <Route path="sequences/:id" element={<SequenceView />} />

            <Route path="users" element={<UsersList />} />
            <Route path="users/new" element={<NewUser />} />
            <Route path="users/:name" element={<UserView />} />

            <Route path="connections/:id" element={<ConnectionView />} />

            <Route path="logs" element={<LogsViewer />} />

            <Route path="settings" element={<Settings />} />
          </Route>

          <Route path="*" element={<Navigate to="/admin" replace />} />
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
