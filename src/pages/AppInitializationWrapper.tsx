import { CircularProgress } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Centered, Screen } from "~src/components";
import { observer } from "mobx-react";
import authState from "~src/state/auth";

const AppInitializationWrapper = ({
  children,
}: React.PropsWithChildren<{}>) => {
  if (!authState.isInitialized) {
    return (
      <Screen>
        <Centered>
          <CircularProgress isIndeterminate />
        </Centered>
      </Screen>
    );
  }
  console.log(authState.isAuthorized, authState);

  if (!authState.isAuthorized) {
    return (
      <Navigate
        to={{ pathname: "/login", search: "next=" + location.pathname }}
      />
    );
  }

  return <>{children}</>;
};

export default observer(AppInitializationWrapper);
