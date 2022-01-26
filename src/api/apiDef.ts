type _ValueOf<T> = T[keyof T];

export module requests {
  export type Register = {
    username: string;
    password: string;
  };

  export type Login = {
    login: string;
    password: string;
  };

  export type ResetPassword = {
    password_reset_token: string
    new_password: string
  }

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

  export type UpdateApplication = {
    tags?: string[];
    disabled?: boolean;
    description?: string;
    name?: string;
  };

  export type GetEventsParams = {
    event_key?: string | null;
    related_task?: "*" | string | null;
    event_type?: "*" | string | null;
    sequence_id?: string | null;
    app_id?: string | null
  } & PaginationParams<"_id" | "event_type" | "related_task" | "created_at">;
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
        exp: string;
        password_reset_token: null;
      }
    | {
        password_reset_required: true;
        access_token: null;
        exp: null;
        password_reset_token: string;
      }
  );

  export type ApplicationSettings = {
    receive_offline: boolean;
  };

  export type ConnectionInfo = {
    _id: string;
    ip: string;
    connected_at: string;
    disconnected_at: string | null;
    client_name: string | null;
    is_connected: boolean;
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

  export interface DetailedApplicationView extends ApplicationView {
    settings: any;
  }

  export type ApplicationResponse = {
    app: DetailedApplicationView;
    connections: ConnectionInfo[];
  };

  export type Event = {
    event_key: string;
    sequence_id: string | null;
    app_id: string;
    event_type: string;
    related_task: string | null;
    data: any | null;
    publisher_ip: string | null;
    created_at: string;
    _id: string;
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

  export type ServerView = {
    os: string | null;
    ip: string;
    last_seen: string;
    _id: string;
  };
}

export module ws {
  export type Message<T, TMessageType> = {
    msg_type: TMessageType;
    data: T;
  };

  export type SubscribeEventsData = {
    app_id?: string | null;
    related_task?: string | null;
    event_type?: string | null;
    sequence_id?: string | null;
  };

  //#region entry_update

  export type SubscribeEntryData = {
    id: string;
    entry_type: string;
  };

  export type EntryUpdateDataTemplate<T = any, TEntryName = string> = {
    entry_type: TEntryName;
    id: string;
    entry: T;
  };

  export interface EntryUpdateDataRegistry {
    application: Partial<models.ApplicationView>;
    server: Partial<models.ServerView>;
    connection_info: Partial<models.ConnectionInfo>;
  }

  export type AnyEntryUpdateData = _ValueOf<{
    [K in keyof EntryUpdateDataRegistry]: EntryUpdateDataTemplate<
      EntryUpdateDataRegistry[K],
      K
    >;
  }>;

  //#endregion

  export interface MREntryUpdates {
    entry_update: AnyEntryUpdateData;
    entry_updates: { updates: AnyEntryUpdateData[] };
  }

  export interface MRNewEvents {
    new_event: models.Event;
  }

  interface UserHubEntryDescriptor {
    entry_type: string;
    id: string;
  }

  export interface MRUserHub {
    unsub_from_app_events: string[];
    sub_to_app_events: string[];
    subscribe_entry: UserHubEntryDescriptor;
    unsubscribe_entry: UserHubEntryDescriptor;
  }

  export type RegistryMessage<Registry extends object> = _ValueOf<{
    [K in keyof Registry]: Message<Registry[K], K>;
  }>;
}

export module settings {
  export interface TaskDescriptor {
    cmd: string | null;
    on_events: string[];
    cron: string | null;
    env: Record<string, string>;
    task_name: string;
  }

  export interface HostSettings {
    tasks: TaskDescriptor[];
  }
}
