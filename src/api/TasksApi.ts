import ApiBase from './ApiBase';
import { api, pagination, rest } from './definition';

export default class TasksApi extends ApiBase implements api.ITasks {
  getTaskSequences(
    taskID: string,
    params?: pagination.Params
  ): Promise<pagination.Pagination<rest.Sequence, string>> {
    return this.client.get(`tasks/${taskID}/sequences`, { params }).then((r) => r.data);
  }

  get(taskID: string): Promise<rest.TaskStandalone> {
    return this.client.get(`tasks/${taskID}`).then((r) => r.data);
  }

  getByName(appName: string, taskName: string): Promise<rest.TaskStandalone> {
    return this.client.get(`tasks/${appName}/${taskName}`).then((r) => r.data);
  }

  getApplicationTasks(appID: string): Promise<rest.Task[]> {
    return this.client.get(`applications/${appID}/defined-tasks`).then((r) => r.data);
  }

  define(appID: string, body: rest.DefineTask): Promise<rest.TaskStandalone> {
    return this.client
      .post<rest.TaskStandalone>(`applications/${appID}/defined-tasks`, body)
      .then((r) => r.data);
  }

  async delete(taskID: string): Promise<void> {
    await this.client.delete(`tasks/${taskID}`);
  }

  update(taskID: string, body: rest.UpdateTask): Promise<rest.TaskStandalone> {
    return this.client.patch(`tasks/${taskID}`, body).then((r) => r.data);
  }
}
