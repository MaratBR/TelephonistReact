import { Alert } from '@cc/Alert';
import { Logo } from '@cc/brand';
import { Button } from '@cc/Button';
import { ContentBox } from '@cc/ContentBox';
import { Input } from '@cc/Input';
import { SerenityLayout } from '@cc/Layout';
import { Stack } from '@cc/Stack';
import { useRequiredStringState, validateAnd } from 'core/hooks';
import { observer } from 'mobx-react';
import React from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import { useGlobalState } from 'state/hooks';

function LoginPage() {
  const loginVal = useRequiredStringState();
  const passwordVal = useRequiredStringState();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { auth } = useGlobalState();

  let formBody: React.ReactNode;

  const login = async () => {
    toast.loading(t('login.progress'), { id: 'login' });
    try {
      await auth.login({
        login: loginVal.value,
        password: passwordVal.value,
      });
    } catch (e) {
      toast.error(t('login.error'), { id: 'login' });
      return;
    }

    if (!auth.isPasswordResetRequired) {
      toast.success(t('login.welcome'), { id: 'login' });
      if (params.has('next')) {
        navigate(params.get('next'));
      } else {
        navigate('/');
      }
    } else {
      toast.remove('login');
      let query = '';
      if (params.has('next')) {
        query = `next=${encodeURIComponent(params.get('next'))}`;
      }
      navigate(`/login/password-reset?${query}`);
    }
  };

  if (auth.isAuthorized) {
    formBody = (
      <>
        <Alert>{t('alreadyloggedin')}</Alert>
        <Button onClick={() => auth.logout()}>{t('logout')}</Button>
      </>
    );
  } else {
    formBody = (
      <>
        <Input
          isInvalid={loginVal.isError}
          disabled={auth.isLoading}
          value={loginVal.value}
          variant="minimal"
          onChange={(e) => loginVal.setValue(e.target.value)}
          placeholder={t('username')}
        />
        <Input
          isInvalid={passwordVal.isError}
          type="password"
          disabled={auth.isLoading}
          value={passwordVal.value}
          variant="minimal"
          onChange={(e) => passwordVal.setValue(e.target.value)}
          placeholder={t('password')}
        />
        <Button
          loading={auth.isLoading}
          color="primary"
          onClick={validateAnd([loginVal, passwordVal], login)}
        >
          {t('login._')}
        </Button>
      </>
    );
  }

  return (
    <SerenityLayout>
      <Logo />
      <ContentBox>
        <Stack spacing="md">{formBody}</Stack>
      </ContentBox>
    </SerenityLayout>
  );
}

export default observer(LoginPage);
