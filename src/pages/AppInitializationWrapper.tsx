import React from "react";
import { Navigate } from "react-router-dom";
import { Centered, Screen } from "@components";
import { observer } from "mobx-react";
import state from "@/state";
import LoadingSpinner from "@components/LoadingSpinner";

const AppInitializationWrapper = ({
  children,
}: React.PropsWithChildren<{}>) => {
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
        to={{ pathname: "/login", search: "next=" + location.pathname }}
      />
    );
  }

  return <>{children}</>;
};

export default observer(AppInitializationWrapper);
