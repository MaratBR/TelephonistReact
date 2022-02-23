import { FormEvent, useState } from 'react';
import { Alert } from '@coreui/Alert';
import { Button } from '@coreui/Button';
import { ContentBox } from '@coreui/ContentBox';
import { Input } from '@coreui/Input';
import { SerenityLayout } from '@coreui/Layout';
import { Stack } from '@coreui/Stack';
import { Heading } from '@coreui/Text';
import TimeCountdown from 'core/components/TimeCountdown';
import { useNextParam, useProperPasswordState } from 'core/hooks';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import { useGlobalState } from 'state/hooks';

export default function PasswordResetPage() {
  const { next, redirectWithNext } = useNextParam();
  const { t } = useTranslation();
  const { auth } = useGlobalState();
  const pwd = useProperPasswordState();
  const [pwd2, setPwd2] = useState('');

  if (auth.passwordResetExpiresAt < Date.now()) {
    toast.error(t('pwdreset.tokenExpired'));
    return (
      <Navigate
        to={{
          pathname: '/login',
          search: `?from=pwdreset.tokenExpired${next ? `&next=${next}` : ''}`,
        }}
      />
    );
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (pwd.value !== pwd2) {
      return;
    }

    toast.loading(t('pwdreset.loading'), { id: 'login' });
    try {
      await auth.resetPassword(pwd.value);
      toast.success(t('pwdreset.success'), { id: 'login' });
      redirectWithNext('/login?from=pwdreset.success');
    } catch (exc) {
      toast.error(exc.toString(), { id: 'login' });
    }
  }

  return (
    <SerenityLayout>
      <ContentBox padded>
        <Heading as="h3">{t('pwdreset.header')}</Heading>
        <p>{t('pwdreset.description')}</p>
        <p>
          {t('pwdreset.remaining')}: <TimeCountdown to={auth.passwordResetExpiresAt} />
        </p>

        <form onSubmit={onSubmit}>
          <Stack spacing="md">
            <Input
              variant="flushed"
              type="password"
              placeholder={t('newPwd')}
              value={pwd.value}
              onChange={(e) => pwd.setValue(e.target.value)}
            />
            <Input
              variant="flushed"
              type="password"
              placeholder={t('repeatNewPwd')}
              value={pwd2}
              onChange={(e) => setPwd2(e.target.value)}
            />
            {pwd2 !== pwd.value ? <Alert color="danger">Passwords do not match!</Alert> : undefined}
            <Button type="submit">{t('setNewPwd')}</Button>
          </Stack>
        </form>
      </ContentBox>
    </SerenityLayout>
  );
}
