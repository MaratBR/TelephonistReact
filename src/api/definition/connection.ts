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
