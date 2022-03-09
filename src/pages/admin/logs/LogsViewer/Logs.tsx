import { useMemo, useState } from 'react';
import ButtonGroup from '@coreui/ButtonGroup';
import { DataGrid, renderDate } from '@coreui/DataGrid';
import { Checkbox } from '@coreui/Input';
import S from './Logs.module.scss';
import { LogRecord, LogSeverity } from 'api/definition';
import classNames from 'classnames';
import Padded from 'pages/Padded';
import { useTranslation } from 'react-i18next';

interface LogRecordViewProps {
  log: LogRecord;
}

const severityClasses = {
  [LogSeverity.DEBUG]: S.debug,
  [LogSeverity.INFO]: S.info,
  [LogSeverity.WARNING]: S.warning,
  [LogSeverity.ERROR]: S.error,
  [LogSeverity.FATAL]: S.fatal,
};

const severityRepr = {
  [LogSeverity.DEBUG]: 'DEBUG',
  [LogSeverity.INFO]: 'INFO',
  [LogSeverity.WARNING]: 'WARN',
  [LogSeverity.ERROR]: 'ERR',
  [LogSeverity.FATAL]: 'FATAL',
};

function renderSeverity(severity: LogSeverity) {
  return (
    <span className={classNames(S.tag, severityClasses[severity])}>
      {severityRepr[severity] ?? '???'}
    </span>
  );
}

function renderBody(v: string) {
  return <span className={S.body}>{v}</span>;
}

interface LogsViewerProps {
  logs: LogRecord[];
}

export default function LogsViewer({ logs }: LogsViewerProps) {
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const td = useMemo(
    () => ({
      severity: '',
      logBody: t('log.body'),
      logTimestamp: t('log.ts'),
    }),
    [language]
  );

  const [raw, setRaw] = useState(false);

  let content: React.ReactNode;

  if (raw) {
    const text = logs
      .map((log) => `${severityRepr[log.severity]} - ${log.t} - ${log.body}`)
      .join('\n');
    content = <pre className={S.raw}>{text}</pre>;
  } else {
    content = (
      <DataGrid
        keyFactory={(v) => v._id}
        data={logs}
        columns={[
          {
            key: 'severity',
            title: td.severity,
            render: renderSeverity,
            width: 60,
          },
          {
            key: 'body',
            title: td.logBody,
            render: renderBody,
          },
          {
            key: 't',
            title: '',
            render: renderDate,
          },
        ]}
      />
    );
  }

  return (
    <>
      <Padded>
        <ButtonGroup>
          <Checkbox onChange={(e) => setRaw(e.target.checked)} id="show-raw-log-action" />
          <label htmlFor="show-raw-log-action">{t('log.showRaw')}</label>
        </ButtonGroup>
      </Padded>
      {content}
    </>
  );
}
