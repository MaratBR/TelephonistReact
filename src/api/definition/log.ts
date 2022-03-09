export enum LogSeverity {
  UNKNOWN = 0,
  DEBUG = 10,
  INFO = 20,
  WARNING = 30,
  ERROR = 40,
  FATAL = 50,
}

export interface LogRecord {
  t: string;
  body: string;
  severity: LogSeverity;
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
