import { Application } from '../application';
import { ConnectionInfo } from '../connection';
import { Event, Sequence } from '../event';
import { Task } from '../tasks';

export interface WSTicketResponse {
  exp: string;
  ticket: string;
}

export interface AppUpdateMessage {
  id: string;
  update: Partial<Omit<Application, '_id'>>;
}

export interface TaskDeletedMessage {
  id: string;
  app_id: string;
}

export interface SequenceMetaMessage {
  id: string;
  meta: Record<string, any>;
}

export interface SequencesMessage {
  sequences: string[];
  update: Partial<Omit<Sequence, '_id'>>;
}

export interface UserHubIncomingMessages {
  app: AppUpdateMessage;
  connection: ConnectionInfo;
  task: Task;
  task_deleted: TaskDeletedMessage;
  new_event: Event;
  sequence_meta: SequenceMetaMessage;
  sequences: SequencesMessage;
}

export interface UserHubOutgoingMessages {
  sub: string | string[];
  unsub: string | string[];
  unsuball: void;
}

export const CG = {
  app(id: string) {
    return `app/${id}`;
  },
  appEvents(id: string) {
    return `appEvents/${id}`;
  },
  sequenceEvents(id: string) {
    return `sequenceEvents/${id}`;
  },
};
