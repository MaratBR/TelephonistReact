import { DefineTask, Task, TaskStandalone, UpdateTask } from 'api/definition';

export const TASKS_API_DI_KEY = Symbol.for('Tasks API');
export interface ITasksApi {
  get(taskID: string): Promise<TaskStandalone>;
  getByName(appName: string, taskName: string): Promise<TaskStandalone>;
  getApplicationTasks(appID: string): Promise<Task[]>;
  define(appID: string, body: DefineTask): Promise<TaskStandalone>;
  delete(taskID: string): Promise<void>;
  update(taskID: string, body: UpdateTask): Promise<TaskStandalone>;
}
