import { ITasksApi } from './definition';
import ApiBase from 'api/ApiBase';
import { DefineTask, Task, TaskStandalone, UpdateTask } from 'api/definition';

export default class TasksApi extends ApiBase implements ITasksApi {
  get(taskID: string): Promise<TaskStandalone> {
    return this.statusService.apiCall(this._client.get(`user-api/tasks/${taskID}`));
  }

  getByName(appName: string, taskName: string): Promise<TaskStandalone> {
    return this.statusService.apiCall(this._client.get(`user-api/tasks/${appName}/${taskName}`));
  }

  getApplicationTasks(appID: string): Promise<Task[]> {
    return this._client.get(`user-api/applications/${appID}/defined-tasks`).then((r) => r.data);
  }

  define(appID: string, body: DefineTask): Promise<TaskStandalone> {
    return this.statusService.apiCall(
      this._client.post<TaskStandalone>(`user-api/applications/${appID}/defined-tasks`, body)
    );
  }

  async delete(taskID: string): Promise<void> {
    await this._client.delete(`user-api/tasks/${taskID}`);
  }

  update(taskID: string, body: UpdateTask): Promise<TaskStandalone> {
    return this._client.patch(`user-api/tasks/${taskID}`, body).then((r) => r.data);
  }
}
