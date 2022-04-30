import React, { useCallback, useState } from 'react';
import { Button } from '@ui/Button';
import ErrorView from '@ui/Error';
import { Input, InputLayout } from '@ui/Input';
import { Stack } from '@ui/Stack';
import { useApi } from 'hooks';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';

type ChangePasswordFormProps = {
  onPasswordChanged: () => void;
};

function ChangePasswordForm({ onPasswordChanged }: ChangePasswordFormProps) {
  const { t } = useTranslation();

  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const { auth: api } = useApi();
  const isInvalid = password !== password2 || password === '' || oldPassword === '';

  const changePassword = useMutation(
    () => api.changePassword({ new_password: password, password: oldPassword }),
    {
      onMutate: () => {
        toast.loading(t('profile.changePassword.loading'), { id: 'changePassword' });
      },
      onSuccess: () => {
        toast.success(t('profile.changePassword.success'), { id: 'changePassword' });
        if (onPasswordChanged) onPasswordChanged();
      },
      onError: () => {
        toast.error(t('profile.changePassword.error'), { id: 'changePassword' });
      },
    }
  );

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (password2 !== password || password === '' || oldPassword === '') return;
      changePassword.mutate();
    },
    [password, password2]
  );

  return (
    <form action="#" onSubmit={onSubmit}>
      <Stack>
        <InputLayout
          header={t('profile.changePassword.currentPassword')}
          id="currentPassword"
          variant="top"
        >
          <Input
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            type="password"
          />
        </InputLayout>

        <InputLayout header={t('profile.changePassword.newPassword')} id="password" variant="top">
          <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
        </InputLayout>

        <InputLayout
          header={t('profile.changePassword.repeatNewPassword')}
          id="password2"
          variant="top"
        >
          <Input value={password2} onChange={(e) => setPassword2(e.target.value)} type="password" />
        </InputLayout>

        <Button
          loading={changePassword.isLoading}
          disabled={changePassword.isLoading || isInvalid}
          type="submit"
        >
          {t('profile.changePassword.submit')}
        </Button>
        <ErrorView error={changePassword.error} />
      </Stack>
    </form>
  );
}

export default ChangePasswordForm;
