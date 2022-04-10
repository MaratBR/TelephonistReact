import { useCallback } from 'react';
import { Button } from '@ui/Button';
import ButtonGroup from '@ui/ButtonGroup';
import { ModalDialog } from '@ui/Modal';
import S from './index.module.scss';
import { mdiExitToApp } from '@mdi/js';
import Icon from '@mdi/react';
import { useApi } from 'hooks';
import useModal from 'hooks/useModal';
import { Trans, useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { logoutThunk } from 'reducers/authReducer';
import { useAppDispatch, useAppSelector } from 'store';

export default function CurrentUser() {
  const { auth } = useApi();
  const { user, isLoggedIn } = useAppSelector((s) => ({
    user: s.auth.user,
    isLoggedIn: s.auth.isLoggedIn,
  }));
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const modal = useModal();

  const onClickLogout = useCallback(() => {
    if (!isLoggedIn) return;

    modal(({ onClose }) => (
      <ModalDialog
        footer={
          <ButtonGroup>
            <Button
              onClick={() => {
                dispatch(logoutThunk({ authAPI: auth }));
                onClose();
              }}
              color="danger"
              left={<Icon path={mdiExitToApp} size={0.9} />}
            >
              {t('logout')}
            </Button>
            <Button onClick={onClose}>{t('cancel')}</Button>
          </ButtonGroup>
        }
        onClose={onClose}
        header={t('areYouSure')}
      >
        {t('wantLogout')}
      </ModalDialog>
    ));
  }, [isLoggedIn, user]);

  return (
    <div className={S.root}>
      <span>
        <Trans i18nKey="login.loggedInAs" values={{ username: user.username }}>
          Logged in as <NavLink to={`/admin/users/${user.username}`}>{'{{username}}'}</NavLink>
        </Trans>
      </span>

      <Button onClick={onClickLogout} className={S.leave} variant="ghost">
        <Icon path={mdiExitToApp} size={1} />
      </Button>
    </div>
  );
}
