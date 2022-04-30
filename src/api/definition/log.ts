export enum LogSeverity {
  UNKNOWN = 0,
  DEBUG = 10,
  INFO = 20,
  WARNING = 30,
  ERROR = 40,
  FATAL = 50,
}

export interface LogRecord {
  t: number;
  body: string;
  severity: LogSeverity;
  app_id: string;
  sequence_id: string;
  _id: string;
}

export interface LogRecordStandalone {
  sequence_id: string | null;
}

export interface LogsMessage {
  app_id: string;
  sequence_id: string | null;
  count: number;
  cursor: string;
}

export function compactLogRecordToRegular(compact: CompactLogRecord): LogRecord {
  return {
    t: compact[0],
    body: compact[1],
    severity: compact[2],
    app_id: compact[3],
    sequence_id: compact[4],
    _id: compact[5],
  };
}

export interface GetLogsOptions {
  app_id?: string;
  sequence_id?: string;
  debug?: boolean;
  info?: boolean;
  warn?: boolean;
  err?: boolean;
  fatal?: boolean;
  cur?: number;
  limit?: number;
}

export type CompactLogRecord = [
  number, // us timestamp
  string, // body
  LogSeverity,
  string, // Application ID
  string, // Sequence ID
  string // record id
];

export interface CompactLogsResponse {
  logs: CompactLogRecord[];
  cur: string;
  limit: string;
  sequence_id: string;
  app_id: string;
}

export interface LogsResponse {
  logs: LogRecord[];
  cur: string;
  limit: string;
  sequence: {
    _id: string;
    name: string;
    task_name: string;
    task_id: string;
  };
  app: {
    _id: string;
    name: string;
    display_name: string;
  };
}
