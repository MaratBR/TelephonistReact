import { t } from "@lingui/macro";
import { observer } from "mobx-react";
import {
  useAppDispatch,
  useAppSelector,
  useLoadingWithError,
  useRequiredStringState,
  validateAnd,
} from "~/src/hooks";
import { Logo, Centered, Screen } from "~/src/components";
import { useNavigate, useParams } from "react-router";
import { authStateSelector, doLogin, doLogout } from "~src/features/authSlice";
import { useEffect, useState } from "react";
import { useLoaderBar } from "~src/components/LoaderBar";
import { useSearchParams } from "react-router-dom";
import {
  Alert,
  Button,
  ButtonGroup,
  Input,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { ContentBox } from "~src/components/ContentBox";
import authState from "~src/state/auth";

const LoginPage = observer((_: {}) => {
  const loginVal = useRequiredStringState();
  const passwordVal = useRequiredStringState();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const loaderBar = useLoaderBar();
  const toast = useToast();

  let formBody: React.ReactNode;

  if (authState.isAuthorized) {
    formBody = (
      <>
        <Alert>{t`You are already logged in`}</Alert>
        <Button onClick={() => authState.logout()}>Log out</Button>
      </>
    );
  } else {
    formBody = (
      <>
        <Input
          isInvalid={loginVal.isError}
          disabled={authState.isLoading}
          value={loginVal.value}
          variant="flushed"
          onChange={(e) => loginVal.setValue(e.target.value)}
          placeholder={t`Your username`}
        />
        <Input
          isInvalid={passwordVal.isError}
          type="password"
          disabled={authState.isLoading}
          value={passwordVal.value}
          variant="flushed"
          onChange={(e) => passwordVal.setValue(e.target.value)}
          placeholder={t`Your password`}
        />
        <ButtonGroup>
          <Button
            isLoading={authState.isLoading}
            variant="contained"
            disabled={loginVal.isError || passwordVal.isError}
            onClick={validateAnd([loginVal, passwordVal], () =>
              authState.login({
                login: loginVal.value,
                password: passwordVal.value,
              })
            )}
          >
            {t`Log In`}
          </Button>
        </ButtonGroup>
      </>
    );
  }

  useEffect(() => {
    if (authState.isAuthorized) {
      toast({
        title: t`Welcome back!`,
        status: "success",
      });
      return;
      if (params.has("next")) {
        navigate({
          pathname: params.get("next"),
          search: "?_from=login",
        });
      } else {
        //navigate("/");
      }
    }
  }, [authState.isAuthorized]);

  useEffect(() => {
    if (authState.isLoading) {
      loaderBar();
    } else {
      loaderBar("clear");
    }

    if (!authState.isLoading && authState.loginError) {
      toast({
        title: t`Oops!`,
        description: authState.loginError,
        status: "error",
      });
    }
  }, [authState.isLoading]);

  return (
    <Screen>
      <Centered>
        <ContentBox>
          <Stack width={240} spacing={2}>
            <Logo size="36" />
            {formBody}
          </Stack>
        </ContentBox>
      </Centered>
    </Screen>
  );
});

export default LoginPage;
