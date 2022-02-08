import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useGlobalState } from "@/api/hooks";
import {
  Alert,
  Button,
  Card,
  Centered,
  Heading,
  Input,
  Screen,
  Stack,
} from "@components";
import TimeCountdown from "@components/TimeCountdown";
import { useNextParam, useProperPasswordState } from "@/hooks";

export default function (props: {}) {
  const { next, redirectWithNext } = useNextParam();
  const { t } = useTranslation();
  const { auth } = useGlobalState();
  const pwd = useProperPasswordState();
  const [pwd2, setPwd2] = useState("");
  const navigate = useNavigate();

  if (auth.passwordResetExpiresAt < Date.now()) {
    toast.error(t("pwdreset.token_expired"));
    return (
      <Navigate
        to={{
          pathname: "/login",
          search:
            "?from=pwdreset.token_expired" + (next ? "&next=" + next : ""),
        }}
      />
    );
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (pwd.value !== pwd2) {
      return;
    }

    toast.loading(t("pwdreset.loading"), { id: "login" });
    try {
      await auth.resetPassword(pwd.value);
      toast.success(t("pwdreset.success"), { id: "login" });
      redirectWithNext("/login?from=pwdreset.success");
    } catch (e) {
      toast.error(e.toString(), { id: "login" });
    }
  }

  return (
    <Screen>
      <Centered>
        <Card>
          <Heading as="h3">{t("pwdreset.header")}</Heading>
          <p>{t("pwdreset.description")}</p>
          <p>
            {t("pwdreset.remaining")}:{" "}
            <TimeCountdown to={auth.passwordResetExpiresAt} />
          </p>

          <form onSubmit={onSubmit}>
            <Stack spacing="md">
              <Input
                variant="flushed"
                type="password"
                placeholder={t("new_password")}
                value={pwd.value}
                onChange={(e) => pwd.setValue(e.target.value)}
              />
              <Input
                variant="flushed"
                type="password"
                placeholder={t("repeat_new_password")}
                value={pwd2}
                onChange={(e) => setPwd2(e.target.value)}
              />
              {pwd2 !== pwd.value ? (
                <Alert color="danger">Passwords do not match!</Alert>
              ) : undefined}
              <Button>{t("set_new_password")}</Button>
            </Stack>
          </form>
        </Card>
      </Centered>
    </Screen>
  );
}
