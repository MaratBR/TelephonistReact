import { css } from "@emotion/react";
import { mdiPlus } from "@mdi/js";
import Icon from "@mdi/react";
import { runInAction } from "mobx";
import { Observer, observer, useLocalObservable } from "mobx-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { settings } from "~src/api";
import { Alert, Button, Grid, Heading, Input, Stack } from "~src/components";

interface Props {
  settings: settings.HostSettings;
}

function HostSettings({ settings }: Props) {
  const value = useLocalObservable(() => ({
    settings,
    addTask() {
      runInAction(() => {
        this.settings.tasks.push({
          task_name: "",
          on_events: [],
          cron: null,
          env: {},
          cmd: "",
        });
      })
    },
  }));
  const { t } = useTranslation();

  return (
    <div>
      <Alert>{t("host_application_alerts")}</Alert>
      <Heading as="h3">{t("task")}</Heading>
      <Button
        onClick={() => value.addTask()}
        left={<Icon size={1} path={mdiPlus} />}
      >
        {t("add_task")}
      </Button>
      {value.settings.tasks.map((task) => (
        <TaskEditor descriptor={task} />
      ))}
    </div>
  );
}

const taskEditorCSS = css`
  border: 1px solid var(--t-neutral-7);
  border-radius: var(--t-radius-sm);
  padding: var(--t-spacing-md);
  margin-top: var(--t-spacing-md);
`;

function TaskEditor({ descriptor }: { descriptor: settings.TaskDescriptor }) {
  const { t } = useTranslation();
  return (
    <div css={taskEditorCSS}>
      <Observer>
        {() => (
          <Stack spacing="md">
            <Heading as="h4">{descriptor.task_name || t("new_task")}</Heading>
            <Grid columns={2} gap="md">
              <Input
                variant="flushed"
                value={descriptor.task_name}
                placeholder={t("task_name")}
                onChange={(e) => runInAction(() => descriptor.task_name = e.target.value)}
              />
              <Input
                variant="flushed"
                value={descriptor.cmd}
                placeholder={t("command")}
                onChange={(e) => runInAction(() => descriptor.cmd = e.target.value)}
              />
              <Input
                variant="flushed"
                value={descriptor.cron}
                placeholder={t("cron_string")}
                onChange={(e) => runInAction(() => descriptor.cron = e.target.value)}
              />
            </Grid>
          </Stack>
        )}
      </Observer>
    </div>
  );
}

export default observer(HostSettings);
