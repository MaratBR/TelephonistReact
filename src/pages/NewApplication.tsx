import { Breadcrumb } from '@cc/Breadcrumb';
import { Button } from '@cc/Button';
import { Card } from '@cc/Card';
import Error from '@cc/Error';
import { Input, Select } from '@cc/Input';
import { Textarea } from '@cc/Input/Input';
import { Stack } from '@cc/Stack';
import TagInput from '@cc/TagInput';
import { Heading } from '@cc/Text';
import api from 'api';
import { FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useNavigate } from 'react-router-dom';

export default function NewApplication() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<'arbitrary' | 'agent' | 'custom'>('arbitrary');
  const [customType, setCustomType] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [error, setError] = useState<string>();
  const { t } = useTranslation();
  const APPLICATION_TYPES = {
    arbitrary: t('application_type_description.arbitrary'),
    host: t('application_type_description.host'),
    custom: t('application_type_description.custom'),
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
      });
      navigate(`/applications/${_id}`);
    } catch (exc) {
      setError(exc.toString());
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack>
      <Breadcrumb>
        <NavLink to="/applications">{t('applications')}</NavLink>
        <span>{name || newApplication}</span>
      </Breadcrumb>

      <Heading>{name || newApplication}</Heading>

      <Card>
        <Error error={error} />
        <form action="#" onSubmit={submit}>
          <Stack spacing="md">
            <Input
              onChange={(e) => setName(e.target.value)}
              required
              placeholder={t('name')}
              variant="flushed"
            />
            <Textarea
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('description')}
            />
            <TagInput
              disallowDuplicates
              submitOnSpace
              placeholder={t('tags')}
              tags={tags}
              onTags={setTags}
            />
            <Select value={type} onChange={(e) => setType(e.target.value as ("arbitrary" | "custom" | "agent"))}>
              <option value="arbitrary">
                {t('application_type.arbitrary')}
              </option>
              <option value="host">{t('application_type.host')}</option>
              <option value="custom">{t('application_type.custom')}</option>
            </Select>
            <p>{APPLICATION_TYPES[type]}</p>
            {type === 'custom' ? (
              <Input
                required
                value={customType}
                onChange={(e) => setCustomType(e.target.value)}
                placeholder={t('custom_application_type')}
              />
            ) : null}
            <Button
              disabled={loading}
              loading={loading}
              type="submit"
              variant="outline"
            >
              {t('save')}
            </Button>
          </Stack>
        </form>
      </Card>
    </Stack>
  );
}
