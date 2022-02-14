import { Breadcrumb } from '@cc/Breadcrumb';
import { ContentBox } from '@cc/ContentBox';
import Error from '@cc/Error';
import { Form, SaveButton } from '@cc/Form';
import {
  Input, InputLayout, Select, Textarea,
} from '@cc/Input';
import { Stack } from '@cc/Stack';
import TagInput from '@cc/TagInput';
import { Heading } from '@cc/Text';
import api from 'api';
import { FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useNavigate } from 'react-router-dom';

export default function NewApplication() {
  const [name, setName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<'arbitrary' | 'agent' | 'custom'>('arbitrary');
  const [customType, setCustomType] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [error, setError] = useState<string>();
  const { t } = useTranslation();
  const APPLICATION_TYPES = {
    arbitrary: t('appType_description.arbitrary'),
    agent: t('appType_description.agent'),
    custom: t('appType_description.custom'),
  };
  const newApplication = t('new_application');
  const navigate = useNavigate();

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { _id } = await api.createApplication({
        name,
        description,
        tags,
        application_type: type === 'custom' ? customType : type,
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
            <InputLayout id="name" header={t("name")}>
              <Input
                onChange={(e) => setName(e.target.value)}
                required
                placeholder={t('name')}
              />
            </InputLayout>
            <InputLayout id="displayName" header={t("displayName")}>
              <Input
                onChange={(e) => setDisplayName(e.target.value)}
                required
                placeholder={t('display_name')}
              />
            </InputLayout>
            <InputLayout id="description" header={t("description")}>
              <Textarea
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t('description')}
              />
            </InputLayout>
            <InputLayout id="tags" header={t("tags")}>
              <TagInput
                disallowDuplicates
                submitOnSpace
                placeholder={t('tags')}
                tags={tags}
                onTags={setTags}
              />
            </InputLayout>
            <Select value={type} onChange={(e) => setType(e.target.value as ("arbitrary" | "custom" | "agent"))}>
              <option value="arbitrary">
                {t('appType.arbitrary')}
              </option>
              <option value="agent">{t('appType.agent')}</option>
              <option value="custom">{t('appType.custom')}</option>
            </Select>
            <p>{APPLICATION_TYPES[type]}</p>
            {type === 'custom' ? (
              <Input
                required
                value={customType}
                onChange={(e) => setCustomType(e.target.value)}
                placeholder={t('CustomAppType')}
              />
            ) : null}
            <SaveButton />
          </Stack>
        </Form>
      </ContentBox>
    </>
  );
}
