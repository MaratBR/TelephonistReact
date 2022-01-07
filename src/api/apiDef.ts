export module requests {
  export type Register = {
    username: string;
    password: string;
  };

  export type Login = {
    login: string;
    password: string;
  };

  export type Refresh = {
    refresh_token: string;
  };

  export type PaginationParams<TOrderBy = string> = {
    order?: "asc" | "desc";
    order_by?: TOrderBy;
    page?: number;
    page_size?: number;
    pages_returned?: number;
  };

  export type CreateApplication = {
    name: string;
    description?: string;
    tags?: string[];
    disabled?: boolean;
    application_type?: "arbitrary" | "host" | string;
  };
}

export module models {
  export type IdObject = { _id: string };

  export type Pagination<T, TOrderBy = string> = {
    page: number;
    page_size: number;
    total: number;
    pages_total: number;
    order_by: TOrderBy;
    order: "desc" | "asc";
    pages_returned: number;
    result: T[];
  };

  export type UserView = {
    username: string;
    email: string;
    disabled: string;
    _id: string;
    created_at: string;
  };

  export type LoginResponse = {
    refresh_token: null;
    token_type: "bearer";
  } & (
    | {
        password_reset_required: false;
        access_token: string;
        password_reset_token: null;
      }
    | {
        password_reset_required: true;
        access_token: null;
        password_reset_token: string;
      }
  );

  export type ApplicationSettings = {
    receive_offline: boolean;
  };

  export type ConnectionInfo = {
    id: string;
    ip: string;
    connected_at: string;
    disconnected_at: string | null;
    client_name: string | null;
  };

  export type Subscription = {
    event_type: string;
    subscribed_at: string;
    related_task: string | null;
  };

  export type ApplicationView = {
    _id: string;
    tags: string[];
    disabled: boolean;
    name: string;
    description: string | null;
    access_key: string;
    application_type: "host" | "arbitrary" | string;
    settings: Record<string, any>;
  };

  export type ApplicationResponse = {
    app: ApplicationView;
    connections: ConnectionInfo[];
    settings: Record<string, any>;
  };

  export enum EventSource {
    USER = "user",
    APPLICATION = "app",
    UNKNOWN = "?",
  }

  export type Event = {
    source_type: EventSource;
    source_id: string;
    event_type: string;
    related_task_type: string | null;
    data: any | null;
    publisher_ip: string | null;
  };

  export type SendDataIf = "always" | "never" | "if_non_0_exit_code";

  export type HostedApplication = {
    name: string;
    command: string;
    env: Record<string, string> | null;
    send_stderr: SendDataIf;
    send_stdout: SendDataIf;
    run_on: string[] | null;
    cron_cfg: string | null;
  };

  export type LocalConfig = {
    hosted_applications: Record<string, HostedApplication>;
  };

  export type HostSoftware = {
    version: string | null;
    name: string;
  };

  export type AppHostView = {
    _id: string;
    name: string;
    software: HostSoftware | null;
    last_active: string | null;
    server_ip: string | null;
    is_online: boolean;
    local_config: LocalConfig;
    local_config_rev: string;
  };

  export type ServerView = {
    os: string | null;
    ip: string;
    last_seen: string;
    _id: string;
  };
}

export module ws {
  export type Message<T = any, TMessageType = string> = {
    msg_type: TMessageType;
    data: T;
  };

  export type NewEventData = {
    event_type: string;
    source_ip: string;
    source_id: string;
    source_type: models.EventSource;
    data: any | null;
    related_task: string;
    created_at: string;
  };

  export type NewEvent = Message<NewEventData, "new_event">;

  export type EntryUpdateData<T = any, TEntryName = string> = {
    entry_name: TEntryName;
    id: string;
    entry: T;
  };

  export type Entries = {
    app: Partial<models.ApplicationView>;
    host: Partial<models.AppHostView>;
    server: Partial<models.ServerView>;
    user: models.UserView;
  };

  type _ValueOf<T> = T[keyof T];
  export type A = _ValueOf<_ValueOf<{ [E in keyof Entries]: Entries[] }>>;

  export type EntryUpdate<K extends keyof Entries = keyof Entries> = Message<
    EntryUpdateData<Entries[K], K>,
    "entry_update"
  >;
}
