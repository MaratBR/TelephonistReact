import ApiBase from "api/ApiBase";
import { DefineTask, Task, TaskStandalone, UpdateTask } from "api/definition";
import { injectable } from "inversify";
import { ITasksApi } from "./definition";

@injectable()
export default class TasksApi extends ApiBase implements ITasksApi {
  getApplicationTask(taskID: string): Promise<TaskStandalone> {
    return this._client
      .get(`user-api/tasks/${taskID}`)
      .then((r) => r.data);
  }

  getApplicationTasks(appID: string): Promise<Task[]> {
    return this._client.get(`user-api/applications/${appID}/defined-tasks`).then((r) => r.data);
  }

  defineNewApplicationTask(appID: string, body: DefineTask): Promise<TaskStandalone> {
    return this._client
      .post(`user-api/applications/${appID}/defined-tasks`, body)
      .then((r) => r.data);
  }

  async deleteApplicationTask(taskID: string): Promise<void> {
    await this._client.delete(`user-api/tasks/${taskID}`);
  }

  updateApplicationTask(taskID: string, body: UpdateTask): Promise<TaskStandalone> {
    return this._client
      .patch(`user-api/tasks/${taskID}`, body)
      .then((r) => r.data);
  }
}