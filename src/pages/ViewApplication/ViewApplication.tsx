import { css } from "@emotion/react";
import {
  mdiCheck,
  mdiCheckCircle,
  mdiEye,
  mdiEyeMinus,
  mdiEyeOff,
  mdiPen,
  mdiPencil,
} from "@mdi/js";
import Icon from "@mdi/react";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink, useParams } from "react-router-dom";
import { models } from "@/api";
import { useApplicationEvents, useLiveApplication } from "@/api/hooks";
import {
  Breadcrumb,
  Button,
  Card,
  Centered,
  Heading,
  HStack,
  Stack,
  StringValue,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  TextHeader,
} from "@components";
import DataGrid, {
  dateRender,
  renderBoolean,
  renderObjectID,
} from "@components/DataGrid";
import EventsViewer from "@components/EventsViewer";
import LoadingSpinner from "@components/LoadingSpinner";
import Parameters from "@components/Parameters";
import Tag from "@components/Tag";
import S from "./PopupModule.module.scss";
import { ApplicationTasks } from "../parts/TasksView";
import ViewApplicationInfo from "./ViewApplicationInfo";

function ViewApplication(_: {}) {
  const { id } = useParams();
  const [application, _refetch] = useLiveApplication(id);
  const name = application.loading ? id : application.value.app.display_name;
  const { t } = useTranslation();

  return (
    <Stack>
      <Breadcrumb>
        <NavLink to="/applications">{t("applications")}</NavLink>
        <span>{name}</span>
      </Breadcrumb>

      <TextHeader title={name} subtitle={application.loading ? 0 : application.value.app.name} />
      <Card>
        {!application.loading ? (
          <ApplicationResponseView response={application.value} />
        ) : (
          <LoadingSpinner size={2} />
        )}
      </Card>
    </Stack>
  );
}

function ApplicationResponseView({
  response,
}: {
  response: models.ApplicationResponse;
}) {
  const [showKey, setShowKey] = useState<boolean>(false);
  const { id } = useParams();
  const { t } = useTranslation();

  return (
    <Tabs tabsID="1">
      <TabList>
        <Tab>{t("information")}</Tab>
        <Tab>{t("tasks")}</Tab>
        <Tab>{t("connections")}</Tab>
        <Tab>{t("events")}</Tab>
      </TabList>

      <TabPanel>
        <ViewApplicationInfo app={response.app} />
      </TabPanel>

      <TabPanel>
        <ApplicationTasks appID={id} />
      </TabPanel>

      <TabPanel>
        {response.connections ? (
          <DataGrid
            keyFactory={(app) => app._id}
            columns={[
              {
                title: t("id"),
                key: "_id",
                render: renderObjectID,
              },
              {
                title: t("is_connected"),
                key: "is_connected",
                render: renderBoolean,
              },
              {
                title: t("client_name"),
                key: "client_name",
              },
              {
                key: "connected_at",
                title: t("connected_at"),
                render: dateRender,
              },
            ]}
            data={response.connections}
          />
        ) : (
          <Centered>{t("no_connections_open")}</Centered>
        )}
      </TabPanel>
      <TabPanel>
        <ApplicationEvents id={id} />
      </TabPanel>
    </Tabs>
  );
}

interface ApplicationEventsProps {
  id: string;
}

const ApplicationEvents = observer(({ id }: ApplicationEventsProps) => {
  const events = useApplicationEvents(id);
  return <EventsViewer events={events.value} />;
});

export default observer(ViewApplication);
