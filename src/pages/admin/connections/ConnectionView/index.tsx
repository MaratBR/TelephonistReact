import { Card } from '@ui/Card';
import Container from '@ui/Container';
import ErrorView from '@ui/Error';
import LoadingSpinner from '@ui/LoadingSpinner';
import PageHeader from '@ui/PageHeader';
import { Parameters } from '@ui/Parameters';
import { Stack } from '@ui/Stack';
import S from './index.module.scss';
import classNames from 'classnames';
import { useApi } from 'hooks';
import { useTopic } from 'hooks/useUserHub';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useParams } from 'react-router';

function ConnectionView() {
  const { t } = useTranslation();
  const { id } = useParams();

  const { connections } = useApi();

  const {
    data: connection,
    error,
    refetch,
    status,
  } = useQuery(['connection', id], () => connections.get(id));

  useTopic(typeof connection !== 'undefined', `m/connections/${id}`, (ctx) => {
    ctx.addEventListener('updated', () => {
      refetch();
    });
  });

  let content: React.ReactNode;

  if (status === 'loading') {
    content = <LoadingSpinner />;
  } else if (status === 'error') {
    content = <ErrorView error={error} />;
  } else {
    content = (
      <Card>
        <Parameters
          parameters={{
            [t('id')]: connection._id,
            [t('clientName')]: connection.client_name,
            [t('clientVersion')]: connection.client_version,
            [t('os')]: connection.os,
          }}
        />
      </Card>
    );
  }

  return (
    <>
      <PageHeader
        subtitle={`${t('connection')} (${(connection?.is_connected
          ? t('connected')
          : t('disconnect')
        ).toLowerCase()})`}
        title={
          connection ? (
            <Stack h>
              <span
                className={classNames(S.connectionBull, {
                  [S.connected]: connection.is_connected,
                })}
              />
              {id}
            </Stack>
          ) : (
            id
          )
        }
      />
      <Container>{content}</Container>
    </>
  );
}

export default ConnectionView;
