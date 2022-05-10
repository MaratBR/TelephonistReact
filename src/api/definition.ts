import { ValueOf } from 'core/utils/types';

export module api {
  export interface IApplications {
    getAll(
      params?: pagination.Params<'_id' | 'name'>
    ): Promise<pagination.Pagination<rest.Application>>;
    get(id: string): Promise<rest.ApplicationResponse>;
    getByName(name: string): Promise<rest.ApplicationResponse>;
    create(data: rest.CreateApplication): Promise<rest.IdObject>;
    update(id: string, update: rest.UpdateApplication): Promise<rest.Application>;
    checkName(name: string): Promise<boolean>;
    createRegistrationCode(params?: { del_code?: string }): Promise<rest.CodeRegistrationResponse>;
    deleteRegistrationCode(code: string): Promise<void>;
  }

  export interface IAuth {
    authorize(data: rest.LoginRequest): Promise<rest.LoginResponse>;
    resetPassword(data: rest.ResetPassword): Promise<void>;
    whoami(): Promise<rest.WhoAmI>;
    getCSRFToken(): Promise<string>;
    logout(): Promise<void>;
    changePassword(data: rest.ChangePassword): Promise<void>;
  }

  export interface IConnections {
    get(id: string): Promise<rest.ConnectionInfo>;
  }

  export interface IEvents {
    getAll(params: rest.GetEventsParams): Promise<pagination.Pagination<Event, rest.EventsOrderBy>>;
    get(id: string): Promise<Event>;
    getSequence(sequenceID: string): Promise<rest.SequenceStandalone>;
    getSequences(params: rest.GetSequencesParams): Promise<rest.SequencesPagination>;
  }

  export interface ITasks {
    get(taskID: string): Promise<rest.TaskStandalone>;
    getByName(appName: string, taskName: string): Promise<rest.TaskStandalone>;
    getApplicationTasks(appID: string): Promise<rest.Task[]>;
    define(appID: string, body: rest.DefineTask): Promise<rest.TaskStandalone>;
    delete(taskID: string): Promise<void>;
    update(taskID: string, body: rest.UpdateTask): Promise<rest.TaskStandalone>;
    getTaskSequences(
      taskID: string,
      params?: pagination.Params
    ): Promise<pagination.Pagination<rest.Sequence>>;
  }

  export interface IUsers {
    getUsers(
      params: pagination.Params<'_id' | 'username'>
    ): Promise<pagination.Pagination<rest.User>>;
    getUser(id: string): Promise<rest.UserResponse>;
    create(body: rest.CreateUser): Promise<rest.User>;
    block(id: string, body: rest.BlockUser): Promise<void>;
    closeSession(userID: string, sessionRefID: string): Promise<void>;
  }

  export interface ILogs {
    getLogs(options: rest.GetLogsOptions): Promise<rest.LogsResponse>;
  }
}

export module pagination {
  export interface Pagination<T, TOrderBy extends string = string> {
    result: T[];
    page: number;
    page_size: number;
    total: number;
    pages_total: number;
    order_by: TOrderBy;
    order: 'asc' | 'desc';
    pages_returned: number;
  }

  export interface Params<TOrderBy extends string = string> {
    page?: number;
    page_size?: number;
    pages_returned?: number;
    order?: 'asc' | 'desc';
    order_by?: TOrderBy;
  }
}

export module ws {
  // #region protocol

  export type OutMessage<T = any, TMessageType = string> = {
    t: TMessageType;
    d: T;
  };

  export type InMessage<T = any, TMessageType = string> = {
    t: TMessageType;
    d: T;
    topic: string;
  };

  interface Serializable {
    [x: string]: string | number | boolean | Date | Serializable | SerializableArray;
  }
  interface SerializableArray
    extends Array<string | number | boolean | Date | Serializable | SerializableArray> {}

  export type OutRegistryMessage<Registry> = ValueOf<{
    [K in keyof Registry]: OutMessage<Registry[K], K>;
  }>;

  export type InRegistryMessage<Registry> = ValueOf<{
    [K in keyof Registry]: InMessage<Registry[K], K>;
  }>;

  // #endregion

  // #region UserHub

  export interface WSTicketResponse {
    exp: string;
    ticket: string;
  }

  export interface AppUpdateMessage {
    id: string;
    update: Partial<Omit<rest.Application, '_id'>>;
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
    update: Partial<Omit<rest.Sequence, '_id'>>;
  }

  export interface SyncState {
    topics: string[];
  }

  export interface UserHubIncomingMessages {
    app: AppUpdateMessage;
    connection: rest.ConnectionInfo;
    task: rest.Task;
    task_deleted: TaskDeletedMessage;
    new_event: Event;
    sequence_meta: SequenceMetaMessage;
    sequences: SequencesMessage;
    sync: SyncState;
    cr_complete: {
      cr: string;
      app_id: string;
      app_name: string;
    };
    updated: void;
  }

  export interface UserHubOutgoingMessages {
    sub: string | string[];
    unsub: string | string[];
    unsuball: void;
    set_topics: string[];
    cs: any;
  }

  // #endregion
}

export module rest {
  // #region User

  export interface UserSession {
    ip: string;
    user_agent: {
      raw: string;
      detected: {
        browser?: {
          name?: string | null;
          version?: string | null;
        };
        platform?: {
          name?: string | null;
          version?: string | null;
        };
        os?: {
          name?: string | null;
          version?: string | null;
        };
      };
    };
    id: string;
    created_at: string;
  }

  export interface UserResponse {
    user: User;
    sessions: UserSession[];
    last_events: AuthEvent[];
  }

  export interface CreateUser {
    username: string;
    is_superuser: boolean;
    email: string;
    password: string;
  }

  export interface BlockUser {
    reason?: string;
  }

  // #endregion

  // #region Sequence

  export interface Event {
    event_key: string;
    sequence_id: string | null;
    app_id: string;
    event_type: string;
    task_name: string;
    task_id: string;
    data: any | null;
    publisher_ip: string | null;
    t: number;
    _id: string;
  }

  export type EventsOrderBy = '_id' | 'event_type' | 'task_name' | 'created_at';

  export enum SequenceState {
    FAILED = 'failed',
    SUCCEEDED = 'succeeded',
    IN_PROGRESS = 'in_progress',
    FROZEN = 'frozen',
  }

  export interface TriggeredBy {
    trigger_type: string;
    trigger_body: any;
    extra: null | Record<string, any>;
  }

  export interface Sequence {
    _id: string;
    name: string;
    app_id: string;
    finished_at: string | null;
    description: string | null;
    meta: null | Record<string, any>;
    state: SequenceState;
    task_name: string | null;
    task_id: string | null;
    expires_at: string | null;
    error: string | null;
    triggered_by: TriggeredBy;
    connection_id: string | null;
    created_at: string;
  }

  export interface SequenceStandalone extends Omit<Sequence, 'connection_id' | 'app_id'> {
    app: {
      _id: string;
      name: string;
      display_name: string;
      deleted_at: string | null;
    };
    connection: ConnectionInfo;
    host: ServerInfo;
  }

  export function toSequenceProcess(v: any): SequenceProcess {
    if (typeof v !== 'object' || v === null) return {};
    let { progress, steps_done, steps_total, description } = v;
    if (typeof progress !== 'number' && typeof progress !== 'number') progress = undefined;
    if (typeof steps_done !== 'number' && typeof steps_done !== 'undefined') steps_done = undefined;
    if (typeof steps_total !== 'number' && typeof steps_total !== 'undefined')
      steps_total = undefined;
    if (typeof description !== 'string' && typeof description !== 'undefined')
      description = undefined;
    return {
      progress,
      steps_done,
      steps_total,
      description,
    };
  }

  interface SequenceProcess {
    progress?: number;
    steps_done?: number;
    steps_total?: number;
    description?: string;
  }

  export function toSequenceMeta(v: any): SequenceMeta {
    return toSequenceProcess(v);
  }

  export interface SequenceMeta extends SequenceProcess {}

  export interface GetEventsParams extends pagination.Params<EventsOrderBy> {
    event_type?: string;
    task_name?: string;
    event_key?: string;
    app_id?: string;
    before?: string;
    sequence_id?: string;
  }

  export interface GetSequencesParams extends pagination.Params<'_id'> {
    app_id?: string;
    state?: SequenceState | SequenceState[];
  }

  export function isSequenceState(v: any): v is SequenceState {
    return [
      SequenceState.FAILED,
      SequenceState.FROZEN,
      SequenceState.IN_PROGRESS,
      SequenceState.SKIPPED,
      SequenceState.SUCCEEDED,
    ].includes(v);
  }

  export type SequencesPagination = pagination.Pagination<Sequence> & {
    counters: {
      failed: CounterValues;
      total: CounterValues;
      finished: CounterValues;
    };
  };

  // #endregion

  // #region Task

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
    body: TaskBody;
    app_id: string;
  }

  export interface TaskStandalone extends Omit<Task, 'app_id'> {
    app: {
      _id: string;
      name: string;
      display_name: string;
    };
    stats: {
      failed_in_24h: number;
    };
  }

  export const TASK_SCRIPT = 'script';
  export const TASK_EXEC = 'exec';
  export const TASK_ARBITRARY = 'arbitrary';

  export const DEFAULT_TASK_BODY: Record<string, () => any> = {
    [TASK_SCRIPT]: () => '#!/bin/bash\necho "It works in shell!"',
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

  // #endregion

  // #region Application

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
    disabled?: boolean;
    tags?: string[];
  }

  export interface CodeRegistrationResponse {
    code: string;
    expires_at: string;
    ttl: number;
  }

  // #endregion

  // #region Auth

  export interface LoginRequest {
    username: string;
    password: string;
  }

  export interface PasswordResetResponse {
    detail: 'Password reset required';
    password_reset: {
      token: string;
      exp: string;
    };
  }

  interface LoggedInResponse {
    csrf: string;
    user: User;
    session_ref_id: string;
  }

  export type LoginResponse = LoggedInResponse | PasswordResetResponse;

  export function isPasswordReset(o: LoginResponse): o is PasswordResetResponse {
    return (
      typeof o === 'object' &&
      o !== null &&
      typeof (o as any).password_reset === 'object' &&
      typeof (o as any).password_reset.token === 'string' &&
      typeof (o as any).password_reset.exp === 'string'
    );
  }

  export interface ResetPassword {
    password_reset_token: string;
    new_password: string;
  }

  export interface ChangePassword {
    new_password: string;
    password: string;
  }

  export interface User {
    _id: string;
    username: string;
    disabled: boolean;
    id: string;
    email: string;
    is_superuser: boolean;
    created_at: string;
    is_blocked: boolean;
  }

  export interface WhoAmI {
    user: User;
    session_ref_id: string;
  }

  export interface AuthEvent {}

  // #endregion

  // #region Connection/server

  export interface ConnectionInfo {
    _id: string;
    ip: string;
    connected_at: string;
    disconnected_at: string | null;
    client_name: string | null;
    client_version: string;
    is_connected: boolean;
    os: string;
  }

  export interface ServerInfo {
    ip: string;
    description: string | null;
    os: string | null;
  }

  // #endregion

  // #region Logs

  export enum LogSeverity {
    UNKNOWN = 0,
    DEBUG = 10,
    INFO = 20,
    WARNING = 30,
    ERROR = 40,
    FATAL = 50,
  }

  export interface LogRecord {
    t: number;
    body: string;
    severity: LogSeverity;
    app_id: string;
    sequence_id: string;
    _id: string;
  }

  export interface LogRecordStandalone {
    sequence_id: string | null;
  }

  export interface LogsMessage {
    app_id: string;
    sequence_id: string | null;
    count: number;
    cursor: string;
  }

  export function compactLogRecordToRegular(compact: CompactLogRecord): LogRecord {
    return {
      t: compact[0],
      body: compact[1],
      severity: compact[2],
      app_id: compact[3],
      sequence_id: compact[4],
      _id: compact[5],
    };
  }

  export interface GetLogsOptions {
    app_id?: string;
    sequence_id?: string;
    debug?: boolean;
    info?: boolean;
    warn?: boolean;
    err?: boolean;
    fatal?: boolean;
    cur?: number;
    limit?: number;
  }

  export type CompactLogRecord = [
    number, // us timestamp
    string, // body
    LogSeverity,
    string, // Application ID
    string, // Sequence ID
    string // record id
  ];

  export interface CompactLogsResponse {
    logs: CompactLogRecord[];
    cur: string;
    limit: string;
    sequence_id: string;
    app_id: string;
    sequence: {
      _id: string;
      name: string;
      task_name: string;
      task_id: string;
    };
    app: {
      _id: string;
      name: string;
      display_name: string;
    };
  }

  export type LogsResponse = Omit<CompactLogsResponse, 'logs'> & { logs: LogRecord[] };

  // #endregion

  // #region Misc

  export interface IdObject {
    _id: string;
  }

  interface _CounterValues<T> {
    year: T;
    month: T;
    week: T;
    day: T;
  }

  export type CounterValues = _CounterValues<number>;
  export type CountersNames = _CounterValues<string>;

  // #endregion

  // #region Index API (summary, status)

  type CollectionName = 'app_logs' | 'events' | 'event_sequences' | 'applications';
  type CounterNames = 'finished_sequences' | 'sequences' | 'failed_sequences' | 'events';

  interface Periods<T> {
    total: T;
    year: T;
    month: T;
    week: T;
    day: T;
  }

  interface Counters {
    periods: Periods<string>;
    values: Record<CounterNames, Periods<number>>;
  }

  interface CollectionStats {
    size: number;
    max_size: number | null;
    capped: number;
    count: number;
  }

  export interface TelephonistStats {
    counters: Counters;
    successful_sequences: {
      count: number;
      list: Sequence[];
    };
    failed_sequences: {
      count: number;
      list: Sequence[];
    };
    in_progress_sequences: {
      count: number;
      list: Sequence[];
    };
    db: {
      stats: {
        allocated: number;
        used: number;
        fs_total: number;
        fs_used: number;
      };
      collections: Record<CollectionName, CollectionStats>;
    };
  }

  export interface TelephonistSummary {
    timezone: {
      name: string;
      offset_seconds: number;
    };
    settings: {
      cookies_policy: string;
      non_secure_cookies: boolean;
    };
    version: string;
  }

  // #endregion
}
