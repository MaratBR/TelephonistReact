import { DefineTask, Task, TaskStandalone, UpdateTask } from 'api/definition';

export const TASKS_API_DI_KEY = Symbol.for('Tasks API');
export interface ITasksApi {
  getApplicationTask(taskID: string): Promise<TaskStandalone>;
  getApplicationTasks(appID: string): Promise<Task[]>;
  defineNewApplicationTask(appID: string, body: DefineTask): Promise<TaskStandalone>;
  deleteApplicationTask(taskID: string): Promise<void>;
  updateApplicationTask(taskID: string, body: UpdateTask): Promise<TaskStandalone>;
}
