import React, { useEffect, useState } from 'react';
import { Alert } from '@coreui/Alert';
import ButtonGroup from '@coreui/ButtonGroup';
import ContentSection from '@coreui/ContentSection';
import { Form, SaveButton } from '@coreui/Form';
import { Input, InputLayout, Textarea } from '@coreui/Input';
import TagInput from '@coreui/TagInput';
import { Application, UpdateApplication } from 'api/definition';
import { useApi } from 'api/hooks';
import { useTrackedChanges } from 'core/hooks';
import { useTranslation } from 'react-i18next';
import { ParametersStack } from 'ui/Parameters';

type EditApplicationProps = {
  app: Application;
  onUpdated?: (newApplication: Application) => void;
};

export default function EditApplication({ app, onUpdated }: EditApplicationProps) {
  const [error, setError] = useState<any>();
  const track = useTrackedChanges<UpdateApplication>({
    display_name: app.display_name,
    disabled: app.disabled,
    description: app.description,
    tags: app.tags,
  });
  const api = useApi();

  const _setOriginal = ({ display_name, disabled, description, tags }: Application) =>
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
        const appView = await api.applications.update(app._id, track.changes);
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
          <InputLayout id="name" header={t('name')} isChanged={track.isChanged('display_name')}>
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
          <InputLayout id="tags" header={t('tags')} isChanged={track.isChanged('tags')}>
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
