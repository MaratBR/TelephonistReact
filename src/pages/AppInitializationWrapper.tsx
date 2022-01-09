import { CircularProgress } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Centered, Screen } from "~src/components";
import { observer } from "mobx-react";
import state from "~src/state";

const AppInitializationWrapper = ({
  children,
}: React.PropsWithChildren<{}>) => {
  if (!state.auth.isInitialized) {
    return (
      <Screen>
        <Centered>
          <CircularProgress isIndeterminate />
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
