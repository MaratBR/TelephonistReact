import { Breadcrumb } from '@ui/Breadcrumb';
import { Button } from '@ui/Button';
import ButtonGroup from '@ui/ButtonGroup';
import Container from '@ui/Container';
import ContentSection from '@ui/ContentSection';
import ErrorView from '@ui/Error';
import LoadingSpinner from '@ui/LoadingSpinner';
import PageHeader from '@ui/PageHeader';
import { Parameters } from '@ui/Parameters';
import { Text } from '@ui/Text';
import SequenceMetaBar from './SequenceMetaBar';
import SequenceStateView from './SequenceStateView';
import TriggeredByView from './TriggeredByView';
import { mdiText } from '@mdi/js';
import Icon from '@mdi/react';
import { ConnectionInfo, SequenceStandalone, SequenceState, ServerInfo } from 'api/definition';
import { isNotFound } from 'api/utils';
import { useApi } from 'hooks';
import { Trans, useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useParams } from 'react-router';
import { NavLink, useSearchParams } from 'react-router-dom';

function getBackAction(params: URLSearchParams, sequence: SequenceStandalone | undefined) {
  if (!sequence) return undefined;

  if (params.has('ba')) {
    const ba = params.get('ba');
    switch (ba) {
      case 'a':
        return `/admin/applications/${sequence.app.name}`;
      case 't':
        return `/admin/tasks/${sequence.task_name}`;
      default:
        return undefined;
    }
  }
  return undefined;
}

function SequenceConnectionView({
  connection,
  server,
}: {
  connection: ConnectionInfo;
  server: ServerInfo;
}) {
  return (
    <>
      <h3>
        <NavLink to={`/admin/connections/${connection._id}`}>{connection._id}</NavLink>
      </h3>
      <Trans
        values={{ os: server.os, name: connection.client_name, serverName: server.ip }}
        i18nKey="sequence.connectionDescription"
      >
        <b>{'{{name}}'}</b> at {'{{serverName}}'} <br />
        <Text type="hint">{'{{os}}'}</Text>
      </Trans>
    </>
  );
}

export default function SequenceView() {
  const { id } = useParams();
  const { t } = useTranslation();
  const { events } = useApi();
  const {
    data: sequence,
    error,
    isLoading,
  } = useQuery(['sequence', id], () => events.getSequence(id), {
    refetchInterval: (v) => {
      if (!v || v.state === SequenceState.IN_PROGRESS) {
        return 1800;
      }
      if (v.state === SequenceState.FROZEN) {
        return 10000;
      }
      return undefined;
    },
  });
  const title = isLoading ? t('loading') : `${t('sequence._')} – ${sequence.name}`;

  const breadcrumb = sequence ? (
    <Breadcrumb>
      <NavLink to={`/admin/applications/${sequence.app.name}`}>{sequence.app.display_name}</NavLink>
      <NavLink to={`/admin/tasks/${sequence.task_name}`}>
        {sequence.task_name.split('/')[1]}
      </NavLink>
      <span>{sequence.name}</span>
    </Breadcrumb>
  ) : undefined;

  const [params] = useSearchParams();
  const backAction = getBackAction(params, sequence);

  let content: React.ReactNode;

  if (isLoading) {
    content = <LoadingSpinner />;
  } else if (error) {
    if (isNotFound(error)) {
      content = <ErrorView error={t('sequenceNotFound', { sequence: id })} />;
    } else {
      content = <ErrorView error={error} />;
    }
  } else {
    content = (
      <>
        <ContentSection padded>
          <TriggeredByView triggeredBy={sequence.triggered_by} />
        </ContentSection>
        <ContentSection padded>
          <ButtonGroup>
            <Button
              to={`/admin/logs?sequenceID=${sequence._id}`}
              variant="ghost"
              left={<Icon size={0.9} path={mdiText} />}
            >
              {t('sequence.logs')}
            </Button>
          </ButtonGroup>
        </ContentSection>
        <ErrorView error={sequence.error} />
        <ContentSection padded header={t('generalInformation')}>
          <Parameters
            parameters={{
              [t('id')]: sequence._id,
              [t('name')]: sequence.name,
              [t('sequence.startedAt')]: `${new Date(sequence.created_at).toLocaleString()} (${
                sequence.created_at
              })`,
            }}
          />
        </ContentSection>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1em' }}>
          <ContentSection padded header={t('connection')}>
            {sequence.connection ? (
              <SequenceConnectionView server={sequence.host} connection={sequence.connection} />
            ) : (
              <p>{t('noConnectionAssignedToSequence')}</p>
            )}
          </ContentSection>
          <ContentSection padded header={t('application')}>
            <h3>
              <NavLink to={`/admin/applications/${sequence.app.name}`}>
                {sequence.app.display_name} ({sequence.app.name})
              </NavLink>
            </h3>
            <Text type="hint">{sequence.app._id}</Text>
          </ContentSection>
          <ContentSection padded header={t('task')}>
            <h3>
              <NavLink to={`/admin/tasks/${sequence.task_name}`}>{sequence.task_name}</NavLink>
            </h3>
            <Text type="hint">{sequence.task_id}</Text>
          </ContentSection>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        actions={sequence ? <SequenceStateView state={sequence.state} /> : undefined}
        backAction={backAction}
        top={breadcrumb}
        title={title}
        subtitle={id}
        bottom={
          sequence ? <SequenceMetaBar state={sequence.state} meta={sequence.meta} /> : undefined
        }
      />
      <Container>{content}</Container>
    </>
  );
}
