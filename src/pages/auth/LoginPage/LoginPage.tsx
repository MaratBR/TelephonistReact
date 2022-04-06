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
  const {
    register,
    getValues,
    formState: { errors },
  } = useForm<LoginRequest>();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { auth: api } = useApi();
  const isLoggedIn = useAppSelector((s) => s.auth.isLoggedIn);
  const dispatch = useAppDispatch();

  let formBody: React.ReactNode;

  const login = useMutation(() => api.authorize(getValues()), {
    retry: false,
    onMutate: () => {
      toast.loading(t('login.progress'), { id: 'login' });
    },
    onError: (err) => {
      toast.error(t('login.error'), { id: 'login' });
      toast.error(err.toString());
    },
    onSuccess: (data) => {
      dispatch(handleLoginResponse(data));
      if (isPasswordReset(data)) {
        navigate(`/login/password-reset`);
      } else {
        if (params.has('next')) {
          navigate(params.get('next'));
        } else {
          navigate('/');
        }
        toast.success(t('login.welcome'), { id: 'login' });
      }
    },
  });

  if (isLoggedIn) {
    formBody = (
      <>
        <Alert>{t('alreadyloggedin')}</Alert>
        <Button onClick={() => dispatch(logout({}))}>{t('logout')}</Button>
      </>
    );
  } else {
    formBody = (
      <>
        <InputLayout variant="top" id="username" header={t('username')}>
          <Input
            id="username"
            isInvalid={!!errors.username}
            disabled={login.isLoading}
            placeholder={t('username')}
            {...register('username')}
          />
        </InputLayout>
        <InputLayout variant="top" id="password" header={t('password')}>
          <Input
            isInvalid={!!errors.password}
            type="password"
            disabled={login.isLoading}
            {...register('password')}
            placeholder={t('password')}
          />
        </InputLayout>
        <Button loading={login.isLoading} color="primary" onClick={() => login.mutate()}>
          {t('login._')}
        </Button>
      </>
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
