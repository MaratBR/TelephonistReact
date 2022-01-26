import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, NavLink, useParams } from "react-router-dom";
import api, { models, requests } from "~src/api";
import {
  Alert,
  Breadcrumb,
  Button,
  ButtonGroup,
  Card,
  Heading,
  Input,
  Stack,
  Textarea,
} from "~src/components";
import LoadingSpinner from "~src/components/LoadingSpinner";
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

  const { t } = useTranslation();

  if (loading) {
    content = <LoadingSpinner />;
  } else {
    content = (
      <Stack spacing="md">
        <Input
          placeholder={t("name")}
          variant="flushed"
          value={track.value("name")}
          onChange={(e) => track.set({ name: e.target.value })}
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
          <Button
            left={<i className="fas fa-save" />}
            loading={submitting}
            onClick={() => submit()}
          >
            {t("save")}
          </Button>
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
