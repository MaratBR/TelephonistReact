import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, NavLink, useParams } from "react-router-dom";
import api, { models, requests } from "@/api";
import {
  Alert,
  Breadcrumb,
  Button,
  ButtonGroup,
  Card,
  Heading,
  Input,
  SaveButton,
  Stack,
  Textarea,
} from "@components";
import LoadingSpinner from "@components/LoadingSpinner";
import TagInput from "@components/TagInput";
import { useTrackedChanges } from "@/hooks";

export default function EditApplication(_: {}) {
  const { id } = useParams();

  const [error, setError] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const track = useTrackedChanges<requests.UpdateApplication>();
  const name = track.original ? track.original.display_name : id;

  const _setOriginal = (app: models.ApplicationView) =>
    track.setOriginal({
      display_name: app.display_name,
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

  const { t } = useTranslation();

  if (loading) {
    content = <LoadingSpinner />;
  } else {
    content = (
      <Stack spacing="md">
        <Input
          placeholder={t("name")}
          variant="flushed"
          value={track.value("display_name")}
          onChange={(e) => track.set({ display_name: e.target.value })}
        />
        <Textarea
          placeholder={t("description")}
          value={track.value("description")}
          onChange={(e) => track.set({ description: e.target.value })}
        />
        <TagInput
          placeholder={t("tags")}
          tags={track.value("tags")}
          onTags={(tags) => track.set({ tags })}
        />
        {error ? <Alert color="danger">{error.toString()}</Alert> : undefined}
        <ButtonGroup>
          <SaveButton />
        </ButtonGroup>
      </Stack>
    );
  }

  return (
    <Stack>
      <Breadcrumb>
        <Link to="/applications">{t("applications")}</Link>
        <span>{name}</span>
      </Breadcrumb>

      <Heading>{name}</Heading>
      <Card>{content}</Card>
    </Stack>
  );
}
