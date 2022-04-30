import { Button } from '@ui/Button';
import { ContentBox } from '@ui/ContentBox';
import { Input } from '@ui/Input';
import { SerenityLayout } from '@ui/Layout';
import { Stack } from '@ui/Stack';
import { Heading } from '@ui/Text';
import TimeCountdown from 'core/components/TimeCountdown';
import { useApi } from 'hooks';
import useNextParam from 'hooks/useNextParam';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from 'store';

interface FormData {
  password: string;
  password2: string;
}

export default function PasswordResetPage() {
  const { next, redirectWithNext } = useNextParam();
  const { t } = useTranslation();
  const state = useAppSelector((s) => s.auth);
  const { auth: api } = useApi();
  const { register, getValues } = useForm<FormData>({
    defaultValues: { password2: '', password: '' },
  });

  if (state.passwordReset) {
    if (state.passwordReset.deadline < Date.now()) {
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
  } else {
    toast.error(t('pwdreset.noToken'));
    return (
      <Navigate
        to={{
          pathname: '/login',
          search: `?from=pwdreset.noToken${next ? `&next=${next}` : ''}`,
        }}
      />
    );
  }

  const submit = useMutation(
    async () => {
      const { password, password2 } = getValues();

      if (password !== password2) throw new Error(t('pwdreset.unmatchingPasswords'));

      await api.resetPassword({
        new_password: password,
        password_reset_token: state.passwordReset.token,
      });
    },
    {
      onSuccess: () => {
        toast.success(t('pwdreset.success'), { id: 'login' });
        redirectWithNext('/login?from=pwdreset.success');
      },
      onError: (error) => {
        toast.error(error.toString(), { id: 'login' });
      },
    }
  );

  return (
    <SerenityLayout>
      <ContentBox padded>
        <Heading as="h3">{t('pwdreset.header')}</Heading>
        <p>{t('pwdreset.description')}</p>
        <p>
          {t('pwdreset.remaining')}: <TimeCountdown to={state.passwordReset.deadline} />
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit.mutate();
          }}
        >
          <Stack spacing="md">
            <Input
              variant="flushed"
              type="password"
              placeholder={t('profile.changePassword.newPassword')}
              {...register('password', { required: true })}
            />
            <Input
              variant="flushed"
              type="password"
              placeholder={t('profile.changePassword.repeatNewPassword')}
              {...register('password2')}
            />

            <Button type="submit">{t('setNewPwd')}</Button>
          </Stack>
        </form>
      </ContentBox>
    </SerenityLayout>
  );
}
