import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import React from "react";
import { Centered, Screen } from "./components";
import { ThemeProvider } from "./components/theme";
import LoadingSpinner from "./components/LoadingSpinner";
import styled from "@emotion/styled";

function Loader(_: {}) {
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

const COMPONENTS = {
  LoginPage: lazy(() => import("@/pages/LoginPage")),
  PasswordResetPage: lazy(() => import("@/pages/PasswordResetPage")),
  AllApplications: lazy(() => import("@/pages/AllApplications")),
  NewApplication: lazy(() => import("@/pages/NewApplication")),
  ViewApplication: lazy(
    () => import("@/pages/ViewApplication/ViewApplication")
  ),
};

function AppRouter(_: {}) {
  return (
    <React.Suspense fallback={<Loader />}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={COMPONENTS.LoginPage} />
          <Route
            path="/login/password-reset"
            element={COMPONENTS.PasswordResetPage}
          />
          <Route path="/" element={lazy(() => import("@/pages/MainPage"))}>
            <Route path="applications" element={COMPONENTS.AllApplications} />
            <Route
              path="applications/new"
              element={COMPONENTS.NewApplication}
            />
            <Route
              path="applications/:id"
              element={COMPONENTS.ViewApplication}
            />
            <Route
              path="applications/:id/edit"
              element={lazy(() => import("@/pages/EditApplication"))}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </React.Suspense>
  );
}
