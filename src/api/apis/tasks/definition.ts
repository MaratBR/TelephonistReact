import {
  DefineTask,
  Pagination,
  PaginationParams,
  Sequence,
  Task,
  TaskStandalone,
  UpdateTask,
} from 'api/definition';

export interface ITasksApi {
  get(taskID: string): Promise<TaskStandalone>;
  getByName(appName: string, taskName: string): Promise<TaskStandalone>;
  getApplicationTasks(appID: string): Promise<Task[]>;
  define(appID: string, body: DefineTask): Promise<TaskStandalone>;
  delete(taskID: string): Promise<void>;
  update(taskID: string, body: UpdateTask): Promise<TaskStandalone>;
  getTaskSequences(taskID: string, params?: PaginationParams): Promise<Pagination<Sequence>>;
}
