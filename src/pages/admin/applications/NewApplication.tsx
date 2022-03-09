import { FormEvent, useState } from 'react';
import { Breadcrumb } from '@coreui/Breadcrumb';
import ButtonGroup from '@coreui/ButtonGroup';
import ContentSection from '@coreui/ContentSection';
import Error from '@coreui/Error';
import { Form, SaveButton } from '@coreui/Form';
import { Input, InputLayout, Textarea } from '@coreui/Input';
import TagInput from '@coreui/TagInput';
import { TextHeader } from '@coreui/Text';
import { useApi } from 'api/hooks';
import { useTranslation } from 'react-i18next';
import { NavLink, useNavigate } from 'react-router-dom';
import { ParametersStack } from 'ui/Parameters';

export default function NewApplication() {
  const [name, setName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [error, setError] = useState<string>();

  const { t } = useTranslation();
  const newApplication = t('newApplication');
  const navigate = useNavigate();
  const api = useApi();

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.applications.create({
        name,
        description,
        tags,
        display_name: displayName,
      });
      navigate(`/admin/applications/${name}`);
    } catch (exc) {
      setError(exc.toString());
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Breadcrumb>
        <NavLink to="/applications">{t('applications')}</NavLink>
        <span>{displayName || name || newApplication}</span>
      </Breadcrumb>

      <TextHeader
        title={displayName || name || newApplication}
        subtitle={displayName ? name : undefined}
      />

      <ContentSection padded>
        <Error error={error} />
        <Form action="#" onSubmit={submit}>
          <ParametersStack>
            <InputLayout
              descriptionPos="nearInput"
              id="name"
              header={t('name')}
              description={t('nameCannotBeChangedAfterwards')}
            >
              <Input onChange={(e) => setName(e.target.value)} required placeholder={t('name')} />
            </InputLayout>
            <InputLayout
              descriptionPos="nearInput"
              description={t('displayNameDescription')}
              id="displayName"
              header={t('displayName')}
            >
              <Input
                onChange={(e) => setDisplayName(e.target.value)}
                required
                placeholder={t('displayName')}
              />
            </InputLayout>
            <InputLayout id="description" header={t('description')}>
              <Textarea
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t('description')}
              />
            </InputLayout>
            <InputLayout id="tags" header={t('tags')}>
              <TagInput
                disallowDuplicates
                submitOnSpace
                placeholder={t('tags')}
                tags={tags}
                onTags={setTags}
              />
            </InputLayout>
            <ButtonGroup>
              <SaveButton />
            </ButtonGroup>
          </ParametersStack>
        </Form>
      </ContentSection>
    </>
  );
}
