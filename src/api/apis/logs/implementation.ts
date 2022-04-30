import ILogsApi from './definition';
import ApiBase from 'api/ApiBase';
import {
  CompactLogsResponse,
  GetLogsOptions,
  LogsResponse,
  compactLogRecordToRegular,
} from 'api/definition';

export default class LogsApi extends ApiBase implements ILogsApi {
  async getLogs(options: GetLogsOptions): Promise<LogsResponse> {
    const { data } = await this.client.get<CompactLogsResponse>('logs', { params: options });
    return {
      ...data,
      logs: data.logs.map(compactLogRecordToRegular),
    };
  }
}
