import React, { useCallback } from 'react';
import { Button } from '@ui/Button';
import Container from '@ui/Container';
import ContentSection from '@ui/ContentSection';
import { Checkbox, Input, InputLayout } from '@ui/Input';
import PageHeader from '@ui/PageHeader';
import { CreateUser } from 'api/definition';
import { ParametersStack } from 'components/ui/Parameters';
import { useApi } from 'hooks';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router';

export default function NewUser() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    register,
    getValues,
    formState: { errors, isValid },
  } = useForm<CreateUser>();
  const { users } = useApi();
  const saveUser = useMutation(() => users.create(getValues()), {
    onSuccess: (data) => {
      navigate(`/admin/users/${data.username}`);
    },
  });
  const onSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isValid) {
      saveUser.mutate();
    }
  }, []);

  return (
    <>
      <PageHeader title={t('newUser')} />
      <Container>
        <ContentSection padded>
          <form onSubmit={onSubmit}>
            <ParametersStack>
              <InputLayout id="username" header={t('username')}>
                <Input {...register('username')} />
              </InputLayout>
              <InputLayout
                description={t('userWillBePromptedNewPassword')}
                id="password"
                header={t('password')}
              >
                <Input type="password" {...register('password')} />
              </InputLayout>
              <InputLayout id="su" header={t('isSuperuser')}>
                <Checkbox {...register('is_superuser')} />
              </InputLayout>
            </ParametersStack>
            <Button
              type="submit"
              disabled={saveUser.isLoading}
              loading={saveUser.isLoading}
              color="primary"
            >
              {t('save')}
            </Button>
          </form>
        </ContentSection>
      </Container>
    </>
  );
}
