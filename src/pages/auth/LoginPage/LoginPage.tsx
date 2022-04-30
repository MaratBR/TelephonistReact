import React from 'react';
import { Alert } from '@ui/Alert';
import { Button } from '@ui/Button';
import { ContentBox } from '@ui/ContentBox';
import { Input, InputLayout } from '@ui/Input';
import { SerenityLayout } from '@ui/Layout';
import { Logo } from '@ui/brand';
import { LoginRequest, isPasswordReset } from 'api/definition';
import { useApi } from 'hooks';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import { handleLoginResponse, logout } from 'reducers/authReducer';
import { useAppDispatch, useAppSelector } from 'store';

function LoginPage() {
  const lastLoggedInUsername = useAppSelector((s) => s.auth.lastLogin?.username);

  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm<LoginRequest>({
    defaultValues: {
      password: '',
      username: lastLoggedInUsername,
    },
  });
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { auth: api } = useApi();
  const isLoggedIn = useAppSelector((s) => s.auth.isLoggedIn);
  const dispatch = useAppDispatch();

  let formBody: React.ReactNode;

  const login = useMutation(
    async () => {
      const response = await api.authorize(getValues());
      await api.whoami();
      return response;
    },
    {
      retry: false,
      onMutate: () => {
        toast.loading(t('login.progress'), { id: 'login' });
      },
      onError: (err) => {
        toast.error(t('login.error', { error: err.toString() }), { id: 'login' });
      },
      onSuccess: (response) => {
        dispatch(handleLoginResponse(response));
        toast.success(t('login.welcome'), { id: 'login' });
        if (isPasswordReset(response)) {
          navigate(`/login/password-reset`);
        } else if (params.has('next')) {
          navigate(params.get('next'));
        } else {
          navigate('/');
        }
      },
    }
  );

  if (isLoggedIn) {
    formBody = (
      <>
        <Alert>{t('alreadyloggedin')}</Alert>
        <Button onClick={() => dispatch(logout({}))}>{t('logout')}</Button>
      </>
    );
  } else {
    formBody = (
      <form onSubmit={handleSubmit(() => login.mutate())}>
        <InputLayout
          error={errors.username?.message}
          variant="top"
          id="username"
          header={t('username')}
        >
          <Input
            id="username"
            autoComplete="off"
            isInvalid={!!errors.username}
            disabled={login.isLoading}
            placeholder={t('username')}
            {...register('username', { required: true })}
          />
        </InputLayout>
        <InputLayout
          error={errors.password?.message}
          variant="top"
          id="password"
          header={t('password')}
        >
          <Input
            isInvalid={!!errors.password}
            type="password"
            disabled={login.isLoading}
            {...register('password', { required: true })}
            placeholder={t('password')}
          />
        </InputLayout>
        <Button
          disabled={!isValid && !isDirty}
          loading={login.isLoading}
          color="primary"
          type="submit"
        >
          {t('login._')}
        </Button>
      </form>
    );
  }

  return (
    <SerenityLayout>
      <Logo />
      <ContentBox padded>{formBody}</ContentBox>
    </SerenityLayout>
  );
}

export default LoginPage;
