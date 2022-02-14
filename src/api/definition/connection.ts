export interface ConnectionInfo {
  _id: string;
  ip: string;
  connected_at: string;
  disconnected_at: string | null;
  client_name: string | null;
  is_connected: boolean;
}
