import { AuthEvent, User } from './auth';

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
