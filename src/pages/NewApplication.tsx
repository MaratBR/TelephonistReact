import { FormEvent, useState } from 'react';
import { Breadcrumb } from '@ui/Breadcrumb';
import { ContentBox } from '@ui/ContentBox';
import Error from '@ui/Error';
import { Form, SaveButton } from '@ui/Form';
import { Input, InputLayout, Textarea } from '@ui/Input';
import { Stack } from '@ui/Stack';
import TagInput from '@ui/TagInput';
import { Heading } from '@ui/Text';
import { useApi } from 'api/hooks';
import { useTranslation } from 'react-i18next';
import { NavLink, useNavigate } from 'react-router-dom';

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
      const { _id } = await api.createApplication({
        name,
        description,
        tags,
        display_name: displayName,
      });
      navigate(`/applications/${_id}`);
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
        <span>{name || newApplication}</span>
      </Breadcrumb>

      <Heading>{name || newApplication}</Heading>

      <ContentBox>
        <Error error={error} />
        <Form action="#" onSubmit={submit}>
          <Stack spacing="md">
            <InputLayout id="name" header={t('name')}>
              <Input onChange={(e) => setName(e.target.value)} required placeholder={t('name')} />
            </InputLayout>
            <InputLayout id="displayName" header={t('displayName')}>
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
            <SaveButton />
          </Stack>
        </Form>
      </ContentBox>
    </>
  );
}
