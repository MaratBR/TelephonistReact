import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  CircularProgress,
  Code,
  Heading,
  HStack,
  Stack,
  Tab,
  Button,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tag,
} from "@chakra-ui/react";
import { t } from "@lingui/macro";
import { useEffect, useState } from "react";
import { FaPen } from "react-icons/fa";
import { NavLink, useParams } from "react-router-dom";
import api, { models } from "~src/api";
import { Centered, RenderSettings, StringValue } from "~src/components";
import { ContentBox } from "~src/components/ContentBox";
import Parameters from "~src/components/Parameters";

export default function ViewApplication(_: {}) {
  const [response, setResponse] = useState<models.ApplicationResponse>();
  const { id } = useParams();

  useEffect(() => {
    api.getAppliction(id).then(setResponse);
  }, [id]);

  return (
    <Stack>
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink
            as={NavLink}
            to="/applications"
          >{t`Applications`}</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink>{response ? response.app.name : id}</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <Heading>{response ? response.app.name : id}</Heading>
      <ContentBox>
        {response ? (
          <ApplicationResponseView response={response} />
        ) : (
          <CircularProgress isIndeterminate />
        )}
      </ContentBox>
    </Stack>
  );
}

function ApplicationResponseView({
  response,
}: {
  response: models.ApplicationResponse;
}) {
  const [showKey, setShowKey] = useState<boolean>(false);
  const params = useParams();

  return (
    <Tabs>
      <TabList>
        <Tab>{t`Information`}</Tab>
        <Tab>{t`Settings`}</Tab>
        <Tab>{t`Connections`}</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <HStack justifyContent="end">
            <Button
              as={NavLink}
              to={"/applications/" + params.id + "/edit"}
              size="sm"
              leftIcon={<FaPen />}
            >
              {t`Edit`}
            </Button>
          </HStack>
          <Heading as="h3" size="md">{t`General information`}</Heading>
          <Parameters
            parameters={{
              [t`ID`]: <Code>{response.app._id}</Code>,
              [t`Name`]: <StringValue value={response.app.name} />,
              [t`Description`]: (
                <StringValue value={response.app.description} />
              ),
              [t`Access key`]: (
                <>
                  <Code>
                    {showKey
                      ? response.app.access_key
                      : "application.################"}
                  </Code>
                  <br />
                  <Button onClick={() => setShowKey(!showKey)} variant="link">
                    {showKey ? t`Hide key` : t`Show key`}
                  </Button>
                </>
              ),
              [t`Tags`]: (
                <HStack>
                  {response.app.tags.map((tag) => (
                    <Tag>{tag}</Tag>
                  ))}
                </HStack>
              ),
            }}
          />
        </TabPanel>
        <TabPanel>
          <RenderSettings
            type={response.app.application_type}
            settings={response.app.settings}
          />
        </TabPanel>
        <TabPanel>
          {response.connections ? (
            response.connections.map((connection) => {
              return <pre>{JSON.stringify(connection, null, 4)}</pre>;
            })
          ) : (
            <Centered>{t`No connections open right now`}</Centered>
          )}
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
