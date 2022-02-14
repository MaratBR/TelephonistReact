import React, { useEffect, useState } from 'react';
import { Alert } from '@ui/Alert';
import ButtonGroup from '@ui/ButtonGroup';
import ContentSection from '@ui/ContentSection';
import { Form, SaveButton } from '@ui/Form';
import { Input, InputLayout, Textarea } from '@ui/Input';
import TagInput from '@ui/TagInput';
import api, { models, requests } from 'api';
import { useTrackedChanges } from 'core/hooks';
import { ParametersStack } from 'pages/parts/Parameters';
import { useTranslation } from 'react-i18next';

type EditApplicationProps = {
  app: models.ApplicationView;
  onUpdated?: (newApplication: models.ApplicationView) => void;
};

export default function EditApplication({
  app,
  onUpdated,
}: EditApplicationProps) {
  const [error, setError] = useState<any>();
  const track = useTrackedChanges<requests.UpdateApplication>({
    display_name: app.display_name,
    disabled: app.disabled,
    description: app.description,
    tags: app.tags,
  });

  const _setOriginal = ({
    display_name,
    disabled,
    description,
    tags,
  }: models.ApplicationView) =>
    track.setOriginal({
      display_name,
      disabled,
      description,
      tags,
    });

  useEffect(() => _setOriginal(app), [app]);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (track.changes !== {}) {
      try {
        const appView = await api.updateApplication(app._id, track.changes);
        setError(undefined);
        _setOriginal(appView);
        if (onUpdated) onUpdated(appView);
      } catch (exc) {
        setError(e);
        throw e;
      }
    }
  };

  const { t } = useTranslation();

  return (
    <ContentSection padded header={t('information')}>
      <Form onSubmit={submit}>
        <ParametersStack>
          <InputLayout
            id="name"
            header={t('name')}
            isChanged={track.isChanged('displayName')}
          >
            <Input
              id="name"
              placeholder={t('name')}
              value={track.value('display_name')}
              onChange={(e) => track.set({ display_name: e.target.value })}
            />
          </InputLayout>
          <InputLayout
            id="description"
            header={t('description')}
            isChanged={track.isChanged('description')}
          >
            <Textarea
              id="description"
              placeholder={t('description')}
              value={track.value('description')}
              onChange={(e) => track.set({ description: e.target.value })}
            />
          </InputLayout>
          <InputLayout
            id="tags"
            header={t('tags')}
            isChanged={track.isChanged('tags')}
          >
            <TagInput
              placeholder={t('tags')}
              tags={track.value('tags')}
              onTags={(tags) => track.set({ tags })}
            />
          </InputLayout>
          {error ? <Alert color="danger">{error.toString()}</Alert> : undefined}
          <ButtonGroup>
            <SaveButton />
          </ButtonGroup>
        </ParametersStack>
      </Form>
    </ContentSection>
  );
}
