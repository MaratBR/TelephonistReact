import { Breadcrumb } from '@ui/Breadcrumb';
import { Button } from '@ui/Button';
import ButtonGroup from '@ui/ButtonGroup';
import Container from '@ui/Container';
import ContentSection from '@ui/ContentSection';
import ErrorView from '@ui/Error';
import { Input, InputLayout, Textarea } from '@ui/Input';
import PageHeader from '@ui/PageHeader';
import TagInput from '@ui/TagInput';
import { mdiContentSave } from '@mdi/js';
import Icon from '@mdi/react';
import { CreateApplication } from 'api/definition';
import { ParametersStack } from 'components/ui/Parameters';
import { useApi } from 'hooks';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { NavLink, useNavigate } from 'react-router-dom';
import { isIdent } from 'utils/validation';

export default function NewApplication() {
  const {
    control,
    register,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateApplication>({
    defaultValues: {
      name: '',
      display_name: '',
      disabled: false,
      tags: [],
    },
  });

  const { t } = useTranslation();
  const navigate = useNavigate();
  const { applications } = useApi();
  const submit = useMutation(
    () => {
      return applications.create(getValues());
    },
    {
      onSuccess: ({ _id }) => navigate(`/admin/applications/${_id}?jc=1`),
    }
  );

  return (
    <>
      <PageHeader
        top={
          <Breadcrumb>
            <NavLink to="/applications">{t('applications')}</NavLink>
            <span>{t('newApplication')}</span>
          </Breadcrumb>
        }
        actions={
          <ButtonGroup>
            <Button
              left={<Icon size={0.9} path={mdiContentSave} />}
              color="success"
              form="create-new-application-form"
              type="submit"
              loading={submit.isLoading}
              disabled={submit.isLoading}
            >
              {t('save')}
            </Button>
          </ButtonGroup>
        }
        title={t('newApplication')}
      />

      <Container>
        <ContentSection padded>
          <ErrorView error={submit.error} />
          <form
            id="create-new-application-form"
            action="#"
            onSubmit={handleSubmit(() => submit.mutate())}
          >
            <ParametersStack>
              <InputLayout
                descriptionPos="nearInput"
                id="name"
                header={t('name')}
                error={errors.name?.message}
                description={t('nameCannotBeChangedAfterwards')}
              >
                <Input
                  {...register('name', {
                    validate: (v) =>
                      isIdent(v) ? undefined : t<string>('errors.validation.ident'),
                  })}
                  required
                  placeholder={t('name')}
                />
              </InputLayout>
              <InputLayout
                descriptionPos="nearInput"
                description={t('displayNameDescription')}
                id="displayName"
                header={t('displayName')}
              >
                <Input {...register('display_name')} required placeholder={t('displayName')} />
              </InputLayout>
              <InputLayout id="description" header={t('description')}>
                <Textarea {...register('description')} placeholder={t('description')} />
              </InputLayout>
              <InputLayout id="tags" header={t('tags')}>
                <Controller
                  control={control}
                  name="tags"
                  render={({ field: { value, onChange } }) => (
                    <TagInput
                      value={value}
                      onChange={onChange}
                      disallowDuplicates
                      submitOnSpace
                      placeholder={t('tags')}
                    />
                  )}
                />
              </InputLayout>
            </ParametersStack>
          </form>
        </ContentSection>
      </Container>
    </>
  );
}
