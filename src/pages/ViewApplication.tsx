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
import { models } from "~src/api";
import { useApplicationEvents, useLiveApplication } from "~src/api/hooks";
import {
  Breadcrumb,
  Button,
  Card,
  Centered,
  Grid,
  Heading,
  HStack,
  Stack,
  StringValue,
  Tab,
  TabList,
  TabPanel,
  Tabs,
} from "~src/components";
import DataGrid, {
  dateRender,
  renderBoolean,
  renderObjectID,
} from "~src/components/DataGrid";
import EventsViewer from "~src/components/EventsViewer";
import LoadingSpinner from "~src/components/LoadingSpinner";
import Parameters from "~src/components/Parameters";
import Tag from "~src/components/Tag";
import SettingsView from "./SettingsView";

function ViewApplication(_: {}) {
  const { id } = useParams();
  const [application, _refetch] = useLiveApplication(id);
  const name = application.loading ? id : application.value.app.name;
  const { t } = useTranslation();

  return (
    <Stack>
      <Breadcrumb>
        <NavLink to="/applications">{t("applications")}</NavLink>
        <span>{name}</span>
      </Breadcrumb>

      <Heading>{name}</Heading>
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
        <Tab>{t("settings")}</Tab>
        <Tab>{t("connections")}</Tab>
        <Tab>{t("events")}</Tab>
      </TabList>

      <TabPanel>
        <HStack>
          <Button
            to={"/applications/" + id + "/edit"}
            left={<Icon size={1} path={mdiPencil} />}
          >
            {t("edit")}
          </Button>
        </HStack>
        <Heading as="h3">{t("general_information")}</Heading>
        <Parameters
          parameters={{
            [t("id")]: <code>{response.app._id}</code>,
            [t("name")]: <StringValue value={response.app.name} />,
            [t("description")]: (
              <StringValue value={response.app.description} />
            ),
            [t("access_key")]: (
              <HStack spacing="md">
                <code>
                  {showKey
                    ? response.app.access_key
                    : "application.################"}
                </code>
                <Button
                  variant="link"
                  onClick={() => setShowKey(!showKey)}
                  left={<Icon size={0.8} path={showKey ? mdiEyeOff : mdiEye} />}
                >
                  {showKey ? t("hide_key") : t("show_key")}
                </Button>
              </HStack>
            ),
            [t("tags")]: (
              <HStack>
                {response.app.tags.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </HStack>
            ),
          }}
        />
      </TabPanel>
      <TabPanel>
        <SettingsView
          applicationType={response.app.application_type}
          settings={response.app.settings}
          editable
        />
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
  id: string
}

const ApplicationEvents = observer(({id}: ApplicationEventsProps) => {
  const events = useApplicationEvents(id)
  return <EventsViewer
    events={events.value} />
})

export default observer(ViewApplication);
