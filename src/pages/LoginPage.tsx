import { t } from "@lingui/macro";
import { observer } from "mobx-react";
import { useRequiredStringState, validateAnd } from "~/src/hooks";
import { Logo, Centered, Screen } from "~/src/components";
import { useNavigate } from "react-router";
import { useEffect } from "react";
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
import state from "~src/state";

const LoginPage = observer((_: {}) => {
  const loginVal = useRequiredStringState();
  const passwordVal = useRequiredStringState();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const loaderBar = useLoaderBar();
  const toast = useToast();

  let formBody: React.ReactNode;

  if (state.auth.isAuthorized) {
    formBody = (
      <>
        <Alert>{t`You are already logged in`}</Alert>
        <Button onClick={() => state.auth.logout()}>Log out</Button>
      </>
    );
  } else {
    formBody = (
      <>
        <Input
          isInvalid={loginVal.isError}
          disabled={state.auth.isLoading}
          value={loginVal.value}
          variant="flushed"
          onChange={(e) => loginVal.setValue(e.target.value)}
          placeholder={t`Your username`}
        />
        <Input
          isInvalid={passwordVal.isError}
          type="password"
          disabled={state.auth.isLoading}
          value={passwordVal.value}
          variant="flushed"
          onChange={(e) => passwordVal.setValue(e.target.value)}
          placeholder={t`Your password`}
        />
        <ButtonGroup>
          <Button
            isLoading={state.auth.isLoading}
            variant="contained"
            disabled={loginVal.isError || passwordVal.isError}
            onClick={validateAnd([loginVal, passwordVal], () =>
              state.auth.login({
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
    if (state.auth.isAuthorized) {
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
  }, [state.auth.isAuthorized]);

  useEffect(() => {
    if (state.auth.isLoading) {
      loaderBar();
    } else {
      loaderBar("clear");
    }

    if (!state.auth.isLoading && state.auth.loginError) {
      toast({
        title: t`Oops!`,
        description: state.auth.loginError,
        status: "error",
      });
    }
  }, [state.auth.isLoading]);

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
