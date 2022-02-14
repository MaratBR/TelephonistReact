import { ConnectionInfo } from './connection';
import { Task } from './tasks';

export interface Application {
  _id: string;
  display_name: string;
  tags: string[];
  disabled: boolean;
  name: string;
  description: string | null;
  access_key: string;
  application_type: 'host' | 'arbitrary' | string;
}

export interface ApplicationResponse {
  app: Application;
  connections: ConnectionInfo[];
  tasks: Task[];
}

export interface CreateApplication {
  name: string;
  display_name: string;
  description: string;
  tags: string[];
  disabled?: boolean;
}

export interface UpdateApplication {
  display_name?: string;
  description?: string;
  disabled?: string;
  tags?: string;
}
