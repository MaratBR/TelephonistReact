import { useMemo } from 'react';
import { Breadcrumb } from '@coreui/Breadcrumb';
import Container from '@coreui/Container';
import ContentSection from '@coreui/ContentSection';
import Error from '@coreui/Error';
import LoadingSpinner from '@coreui/LoadingSpinner';
import PageHeader from '@coreui/PageHeader';
import { Parameters } from '@coreui/Parameters';
import SequenceStateView from './SequenceStateView';
import { SequenceStandalone } from 'api/definition';
import { useApi } from 'api/hooks';
import { isNotFound } from 'api/utils';
import { useRefreshableAsyncValue } from 'core/hooks';
import LogsViewer from 'pages/admin/logs/LogsViewer';
import { useTranslation } from 'react-i18next';
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
        return `/admin/tasks/${sequence.app.name}/${sequence.task_name}`;
      default:
        return undefined;
    }
  }
  return undefined;
}

export default function SequenceView() {
  const { id } = useParams();
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const { events } = useApi();
  const {
    value: sequence,
    error,
    isLoading,
  } = useRefreshableAsyncValue(() => events.getSequence(id));
  const title = isLoading ? t('loading') : `${t('sequence')} – ${sequence.name}`;
  const td = useMemo(
    () => ({
      notFound: t('sequenceNotFound', { sequence: id }),
      sequence: t('sequence'),
      id: t('id'),
      name: t('name'),
      connection: t('connnection'),
      clientName: t('clientName'),
    }),
    [language, id]
  );

  const breadcrumb = sequence ? (
    <Breadcrumb>
      <NavLink to={`/admin/applications/${sequence.app.name}`}>{sequence.app.display_name}</NavLink>
      <NavLink to={`/admin/tasks/${sequence.app.name}/${sequence.task_name}`}>
        {sequence.task_name}
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
      content = <Error error={td.notFound} />;
    } else {
      content = <Error error={error} />;
    }
  } else {
    content = (
      <>
        <ContentSection padded>
          <Parameters
            parameters={{
              [td.id]: sequence._id,
              [td.name]: sequence.name,
              [td.connection]: sequence.connection
                ? {
                    [td.id]: sequence.connection._id,
                    [td.clientName]: sequence.connection.client_name,
                  }
                : undefined,
            }}
          />
        </ContentSection>
        <ContentSection>
          <LogsViewer logs={sequence.logs} />
        </ContentSection>
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
      />
      <Container>{content}</Container>
    </>
  );
}
