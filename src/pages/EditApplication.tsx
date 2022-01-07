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
import { NavLink, useParams } from "react-router-dom";
import api, { models } from "~src/api";
import { Centered, RenderSettings, StringValue } from "~src/components";
import { ContentBox } from "~src/components/ContentBox";
import EditabledStringValue from "~src/components/EditableStringValue";
import Parameters from "~src/components/Parameters";

export default function EditApplication(_: {}) {
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
        {response ? undefined : <CircularProgress isIndeterminate />}
      </ContentBox>
    </Stack>
  );
}
