export interface TaskTrigger {
  name: string;
  body: any;
}

export const TRIGGER_FSNOTIFY = 'fsnotify';
export const TRIGGER_EVENT = 'event';
export const TRIGGER_CRON = 'cron';

export const DEFAULT_TRIGGER_BODY: Record<string, () => any> = {
  [TRIGGER_FSNOTIFY]: () => '',
  [TRIGGER_EVENT]: () => '',
  [TRIGGER_CRON]: () => '',
};

export interface TaskTypesRegistry {
  arbitrary: Record<string, any>;
  exec: string;
  script: string;
}

export interface TaskBody {
  type: string;
  value: any;
}

export interface Task {
  _id: string;
  name: string;
  qualified_name: string;
  description: string | null;
  tags: string[];
  triggers: TaskTrigger[];
  env: Record<string, string>;
  last_updated: string;
  disabled: boolean;
  errors: Record<string, string>;
  body: TaskBody;
  app_id: string;
  app_name: string;
}

export interface TaskStandalone extends Omit<Task, 'app_id' | 'app_name'> {
  app: {
    _id: string;
    name: string;
    display_name: string;
  };
}

export const TASK_SCRIPT = 'script';
export const TASK_EXEC = 'exec';
export const TASK_ARBITRARY = 'arbitrary';

export const DEFAULT_TASK_BODY: Record<string, () => any> = {
  [TASK_SCRIPT]: () => '#!/bin/sh\necho "It works in shell!"',
  [TASK_EXEC]: () => 'echo "It works"',
  [TASK_ARBITRARY]: () => ({}),
};

export interface DefineTask {
  _id: string;
  name: string;
  description: string;
  body: TaskBody;
  env: Record<string, string>;
  tags: string[];
  triggers: TaskTrigger[];
  display_name: string;
}

export type UpdateTask = Partial<Omit<DefineTask, '_id'>>;
