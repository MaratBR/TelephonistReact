import { GetLogsOptions, LogsResponse } from 'api/definition';

export default interface ILogsApi {
  getLogs(options: GetLogsOptions): Promise<LogsResponse>;
}
