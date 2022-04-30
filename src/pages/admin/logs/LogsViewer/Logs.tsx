import S from './Logs.module.scss';
import { LogRecord, LogSeverity } from 'api/definition';

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

interface LogsProps {
  logs: LogRecord[];
}

export default function Logs({ logs }: LogsProps) {
  const text = logs.map((log) => (
    <div key={log._id} className={`${S.log} ${severityClasses[log.severity]}`}>
      <pre>{log.body}</pre>
    </div>
  ));

  return <div className={S.raw}>{text}</div>;
}
