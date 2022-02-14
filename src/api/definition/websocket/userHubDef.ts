import { Application } from "../application";
import { ConnectionInfo } from "../connection";
import { Event, Sequence } from "../event";
import { Task } from "../tasks";

export interface AppUpdateMessage {
  id: string;
  update: Partial<Omit<Application, "_id">>;
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
  update: Partial<Omit<Sequence, "_id">>
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
  sub_to_app_events: string[];
  unsub_from_app_events: string[];
  set_application_subscription: string | null;
}
