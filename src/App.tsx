import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { configureAxiosInterceptors } from "~src/api/client";
import theme from "~/src/theme";
import authState from "~/src/state/auth";
import React from "react";
import { Screen } from "./components";
import { Center, ChakraProvider, CircularProgress } from "@chakra-ui/react";

configureAxiosInterceptors(authState);

function Loader(_: {}) {
  return <Screen>
    <Center>
      <CircularProgress isIndeterminate />
    </Center>
  </Screen>
}

const loader = <Loader />

function lazy(component: () => Promise<any>) {
  const LazyComponent = React.lazy(component)
  return <React.Suspense fallback={loader}><LazyComponent /></React.Suspense>
}

export function App() {
  return (
    <ChakraProvider theme={theme}>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <AppRouter />
    </ChakraProvider>
  );
}


function AppRouter(_: {}) {
  return (
    <React.Suspense fallback={<Loader />}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={lazy(() => import("~src/pages/LoginPage"))} />
          <Route path="/" element={lazy(() => import("~src/pages/MainPage"))}>
            <Route path="applications" element={lazy(() => import("~src/pages/AllApplications"))} />
            <Route path="applications/new" element={lazy(() => import("~src/pages/NewApplication"))} />
            <Route path="applications/:id" element={lazy(() => import("~src/pages/ViewApplication"))} />
            <Route path="applications/:id/edit" element={lazy(() => import("~src/pages/EditApplication"))} />
          </Route>
        </Routes>
      </BrowserRouter>
    </React.Suspense>
  );
}
