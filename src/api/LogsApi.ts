import ApiBase from './ApiBase';
import { api, rest } from './definition';

export default class LogsApi extends ApiBase implements api.ILogs {
  async getLogs(options: rest.GetLogsOptions): Promise<rest.LogsResponse> {
    const { data } = await this.client.get<rest.CompactLogsResponse>('logs', { params: options });
    return {
      ...data,
      logs: data.logs.map(rest.compactLogRecordToRegular),
    };
  }
}
