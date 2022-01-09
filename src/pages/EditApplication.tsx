import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  CircularProgress,
  Heading,
  Stack,
  Input,
  Button,
  ButtonGroup,
  Textarea,
  Alert,
} from "@chakra-ui/react";
import { t } from "@lingui/macro";
import { useEffect, useState } from "react";
import { FaSave } from "react-icons/fa";
import { NavLink, useParams } from "react-router-dom";
import api, { models, requests } from "~src/api";
import { ContentBox } from "~src/components/ContentBox";
import TagInput from "~src/components/TagInput";
import { useTrackedChanges } from "~src/hooks";

export default function EditApplication(_: {}) {
  const { id } = useParams();

  const [error, setError] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const track = useTrackedChanges<requests.UpdateApplication>();
  const name = track.original ? track.original.name : id;

  const _setOriginal = (app: models.ApplicationView) =>
    track.setOriginal({
      name: app.name,
      disabled: app.disabled,
      description: app.description,
      tags: app.tags,
    });

  const fetchData = () => {
    setLoading(true);
    api
      .getAppliction(id)
      .then((app) => {
        setError(null);
        _setOriginal(app.app);
      })
      .catch(setError)
      .finally(() => setLoading(false));
  };
  useEffect(fetchData, [id]);

  const submit = () => {
    if (track.changes !== {}) {
      setSubmitting(true);
      api
        .updateApplication(id, track.changes)
        .then((app) => {
          setError(undefined);
          _setOriginal(app);
        })
        .catch(setError)
        .finally(() => setSubmitting(false));
    }
  };

  let content;

  if (loading) {
    content = <CircularProgress isIndeterminate />;
  } else {
    content = (
      <Stack spacing={2}>
        <Input
          placeholder={t`Name`}
          variant="flushed"
          value={track.value("name")}
          onChange={(e) => track.set({ name: e.target.value })}
        />
        <Textarea
          placeholder={t`Description`}
          value={track.value("description")}
          onChange={(e) => track.set({ description: e.target.value })}
        />
        <TagInput
          placeholder={t`Input some tags for this application`}
          tags={track.value("tags")}
          onTagsChange={(_se, tags) => track.set({ tags })}
        />
        {error ? (
          <Alert colorScheme="red">{error.toString()}</Alert>
        ) : undefined}
        <ButtonGroup>
          <Button
            leftIcon={<FaSave />}
            isLoading={submitting}
            onClick={() => submit()}
          >
            {t`Save`}
          </Button>
        </ButtonGroup>
      </Stack>
    );
  }

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
          <BreadcrumbLink>{name}</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <Heading>{name}</Heading>
      <ContentBox>{content}</ContentBox>
    </Stack>
  );
}
