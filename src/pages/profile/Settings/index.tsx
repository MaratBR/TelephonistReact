import { useCallback, useEffect } from 'react';
import { Button } from '@ui/Button';
import { Card } from '@ui/Card';
import Container from '@ui/Container';
import { InputLayout, Select } from '@ui/Input';
import { ModalDialog } from '@ui/Modal';
import { Stack } from '@ui/Stack';
import { TextHeader } from '@ui/Text';
import ChangePasswordForm from './ChangePasswordForm';
import { useApi } from 'hooks';
import useModal from 'hooks/useModal';
import { languageNames } from 'i18n';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import { fetchUserThunk } from 'reducers/authReducer';
import { useAppDispatch } from 'store';

export default function Settings() {
  const dispatch = useAppDispatch();
  const { auth: api } = useApi();
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(fetchUserThunk({ authAPI: api }));
  }, []);

  const openModal = useModal();
  const openChangePasswordModal = useCallback(() => {
    openModal(({ onClose }) => (
      <ModalDialog onClose={onClose}>
        <ChangePasswordForm onPasswordChanged={onClose} />
      </ModalDialog>
    ));
  }, []);

  return (
    <Container>
      <TextHeader title={t('profile.settings.title')} subtitle={t('profile.settings.subtitle')} />
      <Card>
        <Stack>
          <InputLayout id="language" header={t('profile.settings.language')}>
            <Select
              keyFactory={(v) => v}
              onChange={(v) => i18next.changeLanguage(v)}
              value={i18next.language || i18next.languages[0]}
              options={Object.keys(languageNames)}
              renderElement={(v) => languageNames[v]}
            />
          </InputLayout>
          <hr />
          <InputLayout id="language" header={t('profile.changePassword.title')}>
            <Button onClick={openChangePasswordModal}>
              {t('profile.changePassword.actionName')}
            </Button>
          </InputLayout>
        </Stack>
      </Card>
    </Container>
  );
}
