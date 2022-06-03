import { useEffect, useState } from 'react';
import Container from '@ui/Container';
import ContentSection from '@ui/ContentSection';
import ErrorView from '@ui/Error';
import PageHeader from '@ui/PageHeader';
import { Stack } from '@ui/Stack';
import { Text } from '@ui/Text';
import Logs from './Logs';
import { rest } from 'api/definition';
import { useApi } from 'hooks';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { NavLink, useSearchParams } from 'react-router-dom';
import { isNo } from 'utils';

export default function LogsViewer() {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const sequenceID = params.get('sequenceID');
  const appID = params.get('appID');
  const warn = !isNo(params.get('warn'));
  const info = !isNo(params.get('info'));
  const err = !isNo(params.get('warn'));
  const debug = !isNo(params.get('debug'));
  const fatal = !isNo(params.get('fatal'));
  const { logs: api } = useApi();

  const [logs, setLogs] = useState<rest.LogRecord[]>([]);
  const [lastResponse, setLastResponse] = useState<rest.LogsResponse | undefined>();
  const [limit, setLimit] = useState(1000);
  const [cur, setCursor] = useState<number | undefined>();

  const fetch = useMutation(async () => {
    const response = await api.getLogs({
      warn,
      info,
      err,
      debug,
      fatal,
      app_id: appID,
      sequence_id: sequenceID,
      limit,
      cur,
    });

    if (response.logs.length === 0) return;
    setCursor(response.logs[response.logs.length - 1].t);
    setLastResponse(response);
    setLogs(response.logs.concat(logs));
  });

  useEffect(() => fetch.mutate(), []);

  return (
    <>
      <PageHeader title={t('logs._')} />
      <Container>
        {lastResponse ? (
          <Stack h spacing="md">
            {lastResponse.app ? (
              <ContentSection padded header={t('application._')}>
                <h3>
                  <NavLink to={`/admin/applications/${lastResponse.app.name}`}>
                    {lastResponse.app.display_name} ({lastResponse.app.name})
                  </NavLink>
                </h3>
                <Text type="hint">{lastResponse.app._id}</Text>
              </ContentSection>
            ) : undefined}
            {lastResponse.sequence ? (
              <>
                <ContentSection padded header={t('sequence._')}>
                  <h3>
                    <NavLink to={`/admin/sequences/${lastResponse.sequence._id}`}>
                      {lastResponse.sequence._id}
                    </NavLink>
                  </h3>
                </ContentSection>
                <ContentSection padded header={t('task._')}>
                  <h3>
                    <NavLink to={`/admin/tasks/${lastResponse.sequence.task_name}`}>
                      {lastResponse.sequence.task_name}
                    </NavLink>
                  </h3>
                  <Text type="hint">{lastResponse.sequence.task_id}</Text>
                </ContentSection>
              </>
            ) : undefined}
          </Stack>
        ) : undefined}
        <ContentSection padded>
          {fetch.error ? <ErrorView error={fetch.error.toString()} /> : undefined}
          <Logs logs={logs} />
        </ContentSection>
      </Container>
    </>
  );
}
