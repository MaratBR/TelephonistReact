import { observer } from "mobx-react";
import { useRequiredStringState, validateAnd } from "~/src/hooks";
import { Centered, Screen } from "~/src/components";
import { useNavigate } from "react-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import state from "~src/state";
import {
  Alert,
  Button,
  Input,
  Stack,
  Card,
  Logo,
} from "~src/components";
import toast from "react-hot-toast";
import { useGlobalState } from "~src/api/hooks";
import SerenityLayout from "~src/components/layouts/SerenityLayout";

function LoginPage(_: {}) {
  const loginVal = useRequiredStringState();
  const passwordVal = useRequiredStringState();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { auth } = useGlobalState()

  let formBody: React.ReactNode;

  const login = async () => {
    toast.loading(t("login.progress"), {id: "login"})
    try {
      await auth.login({
        login: loginVal.value,
        password: passwordVal.value,
      })
    } catch (e) {
      toast.error(t("login.error"), {id: "login"})
      return
    }

    if (!auth.isPasswordResetRequired) {
      toast.success(t("login.welcome"), {id: "login"})
      if (params.has("next")) {
        navigate(params.get("next"));
      } else {
        navigate("/");
      }
    } else {
      toast.remove("login")
      let query = ""
      if (params.has("next")) {
        query = "next=" + encodeURIComponent(params.get("next"))
      }
      navigate("/login/password-reset?" + query)
    }
  };

  if (state.auth.isAuthorized) {
    formBody = (
      <>
        <Alert>{t("alreadyloggedin")}</Alert>
        <Button
          left={<i className="fa " />}
          onClick={() => state.auth.logout()}
        >
          {t("logout")}
        </Button>
      </>
    );
  } else {
    formBody = (
      <>
        <Input
          isInvalid={loginVal.isError}
          disabled={state.auth.isLoading}
          value={loginVal.value}
          variant="minimal"
          onChange={(e) => loginVal.setValue(e.target.value)}
          placeholder={t("username")}
        />
        <Input
          isInvalid={passwordVal.isError}
          type="password"
          disabled={state.auth.isLoading}
          value={passwordVal.value}
          variant="minimal"
          onChange={(e) => passwordVal.setValue(e.target.value)}
          placeholder={t("password")}
        />
        <Button
          loading={state.auth.isLoading}
          color="primary"
          onClick={validateAnd([loginVal, passwordVal], login)}
        >
          {t("login._")}
        </Button>
      </>
    );
  }

  return (
    <SerenityLayout>
      <Logo />
      <Card>
        <Stack spacing="md">{formBody}</Stack>
      </Card>
    </SerenityLayout>
  );
}

export default observer(LoginPage);
