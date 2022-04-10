import { useCallback } from 'react';
import { Button } from '@ui/Button';
import ButtonGroup from '@ui/ButtonGroup';
import Container from '@ui/Container';
import ContentSection from '@ui/ContentSection';
import { DataGrid, renderBoolean, renderDate } from '@ui/DataGrid';
import ErrorView from '@ui/Error';
import LoadingSpinner from '@ui/LoadingSpinner';
import PageHeader from '@ui/PageHeader';
import { Parameters } from '@ui/Parameters';
import { Stack } from '@ui/Stack';
import BlockUserDialog from './BlockUserDialog';
import CloseSessionDialog from './CloseSessionDialog';
import { mdiAccount, mdiBlockHelper, mdiNotificationClearAll, mdiTrashCan } from '@mdi/js';
import Icon from '@mdi/react';
import { UserSession } from 'api/definition';
import { Shruggie } from 'components/ui/misc';
import { useApi } from 'hooks';
import useModal from 'hooks/useModal';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useParams } from 'react-router';
import { useAppSelector } from 'store';

export default function UserView() {
  const { name } = useParams();
  const { users } = useApi();
  const { t } = useTranslation();
  const { sessionRefID, currentUsername } = useAppSelector((s) => ({
    sessionRefID: s.auth.sRefID,
    currentUsername: s.auth.user.username,
  }));
  const { data, status, error, refetch } = useQuery(['user', name], () => users.getUser(name), {
    retry: 2,
    refetchOnWindowFocus: false,
  });
  const openModal = useModal();

  const renderBlockUserDialog = useCallback(
    ({ onClose }) => (
      <BlockUserDialog
        userID={data.user._id}
        username={data.user.username}
        onClose={onClose}
        onBlocked={() => {
          onClose();
          refetch();
        }}
      />
    ),
    [data]
  );

  const renderCloseSessionDialog = useCallback(
    ({ onClose, refID }) => (
      <CloseSessionDialog
        username={data.user.username}
        userID={data.user._id}
        sessionRefID={refID}
        onClose={onClose}
        onSessionClosed={() => refetch()}
      />
    ),
    [data]
  );

  let content: React.ReactNode;

  const shruggie = useCallback(() => <Shruggie>{t('sessions.empty')}</Shruggie>, []);

  if (status === 'loading') {
    content = <LoadingSpinner />;
  } else if (status === 'error') {
    content = <ErrorView error={error} />;
  } else {
    content = (
      <>
        <ContentSection padded>
          <Parameters
            parameters={{
              [t('id')]: data.user._id,
              [t('username')]: data.user.username,
              [t('user.isSuperuser')]: renderBoolean(data.user.is_superuser),
              [t('user.isBlocked')]: renderBoolean(data.user.is_blocked),
            }}
          />
        </ContentSection>
        <ContentSection padded header={t('sessions._')}>
          <DataGrid<UserSession>
            noItemsRenderer={shruggie}
            keyFactory={(v) => v.id}
            columns={[
              {
                key: 'user_agent',
                title: t('userAgent'),
                render: (ua) => (
                  <div>
                    <span>
                      {t('os')}: {ua.detected.os.name ?? '???'} {ua.detected.os.version ?? ''}
                    </span>
                    <br />
                    <span>
                      {t('browser')}: {ua.detected.browser.name ?? '???'}{' '}
                      {ua.detected.browser.version ?? ''}
                    </span>
                  </div>
                ),
              },
              {
                key: 'created_at',
                title: t('createdAt'),
                render: renderDate,
              },
              {
                key: 'current_session',
                custom: true,
                title: '',
                render: ({ id }) =>
                  sessionRefID === id ? (
                    <Icon title={t('sessions.isCurrent')} size={1} path={mdiAccount} />
                  ) : undefined,
              },
              {
                key: 'actions',
                custom: true,
                title: '',
                render: ({ id }) => (
                  <ButtonGroup>
                    <Button
                      onClick={() => {
                        openModal(({ onClose }) =>
                          renderCloseSessionDialog({ onClose, refID: id })
                        );
                      }}
                      color="danger"
                      variant="ghost"
                    >
                      <Icon path={mdiTrashCan} size={1} />
                    </Button>
                  </ButtonGroup>
                ),
              },
            ]}
            data={data.sessions}
          />
        </ContentSection>
        <ButtonGroup>
          <Button
            onClick={() => openModal(renderBlockUserDialog)}
            left={<Icon path={mdiBlockHelper} size={0.8} />}
            color="danger"
          >
            {t('blockTheUser')}
          </Button>

          <Button left={<Icon path={mdiNotificationClearAll} size={0.8} />} color="danger">
            {t('sessions.closeAll')}
          </Button>
        </ButtonGroup>
      </>
    );
  }

  return (
    <>
      <PageHeader
        backAction="/admin/users"
        title={
          <Stack h alignItems="center">
            {name.toUpperCase() === currentUsername.toUpperCase() ? (
              <Icon path={mdiAccount} size={1} />
            ) : undefined}
            {data ? data.user.username : name}
          </Stack>
        }
      />
      <Container>{content}</Container>
    </>
  );
}
