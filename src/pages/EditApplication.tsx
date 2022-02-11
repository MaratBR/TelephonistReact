import { Alert } from '@cc/Alert';
import { Breadcrumb } from '@cc/Breadcrumb';
import { SaveButton } from '@cc/Button';
import ButtonGroup from '@cc/ButtonGroup';
import { ContentBox } from '@cc/ContentBox';
import { Input, InputLayout, Textarea } from '@cc/Input';
import TagInput from '@cc/TagInput';
import { Heading } from '@cc/Text';
import api, { models, requests } from 'api';
import LoadingSpinner from 'core/components/LoadingSpinner';
import { useTrackedChanges } from 'core/hooks';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';

export default function EditApplication() {
  const { id } = useParams();

  const [error, setError] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const track = useTrackedChanges<requests.UpdateApplication>();
  const name = track.original ? track.original.display_name : id;

  const _setOriginal = (app: models.ApplicationView) => track.setOriginal({
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
      <>
        <InputLayout variant="top" id="name" header={t("name")} description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae, rem quae dolor fuga provident commodi sapiente, praesentium porro magnam?">
          <Input
            variant="flushed"
            id="name"
            placeholder={t('name')}
            value={track.value('display_name')}
            onChange={(e) => track.set({ display_name: e.target.value })}
          />
        </InputLayout>
        <Textarea
          placeholder={t('description')}
          value={track.value('description')}
          onChange={(e) => track.set({ description: e.target.value })}
        />
        <TagInput
          placeholder={t('tags')}
          tags={track.value('tags')}
          onTags={(tags) => track.set({ tags })}
        />
        {error ? <Alert color="danger">{error.toString()}</Alert> : undefined}
        <ButtonGroup>
          <SaveButton />
        </ButtonGroup>
      </>
    );
  }

  return (
    <>
      <Breadcrumb>
        <Link to="/applications">{t('applications')}</Link>
        <span>{name}</span>
      </Breadcrumb>

      <Heading>{name}</Heading>
      <ContentBox>{content}</ContentBox>
    </>
  );
}
