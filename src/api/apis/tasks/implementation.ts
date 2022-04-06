import { ITasksApi } from './definition';
import ApiBase from 'api/ApiBase';
import {
  DefineTask,
  Pagination,
  PaginationParams,
  Sequence,
  Task,
  TaskStandalone,
  UpdateTask,
} from 'api/definition';

export default class TasksApi extends ApiBase implements ITasksApi {
  getTaskSequences(
    taskID: string,
    params?: PaginationParams
  ): Promise<Pagination<Sequence, string>> {
    return this.client.get(`tasks/${taskID}/sequences`, { params }).then((r) => r.data);
  }

  get(taskID: string): Promise<TaskStandalone> {
    return this.client.get(`tasks/${taskID}`).then((r) => r.data);
  }

  getByName(appName: string, taskName: string): Promise<TaskStandalone> {
    return this.client.get(`tasks/${appName}/${taskName}`).then((r) => r.data);
  }

  getApplicationTasks(appID: string): Promise<Task[]> {
    return this.client.get(`applications/${appID}/defined-tasks`).then((r) => r.data);
  }

  define(appID: string, body: DefineTask): Promise<TaskStandalone> {
    return this.client
      .post<TaskStandalone>(`applications/${appID}/defined-tasks`, body)
      .then((r) => r.data);
  }

  async delete(taskID: string): Promise<void> {
    await this.client.delete(`tasks/${taskID}`);
  }

  update(taskID: string, body: UpdateTask): Promise<TaskStandalone> {
    return this.client.patch(`tasks/${taskID}`, body).then((r) => r.data);
  }
}
