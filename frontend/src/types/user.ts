export interface User {
  _id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SearchUser {
  _id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
}

export interface Friend {
  _id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
}

export interface FriendRequest {
  _id: string;
  from?: {
    _id: string;
    email: string;
    displayName: string;
    avatarUrl?: string;
  };
  to?: {
    _id: string;
    email: string;
    displayName: string;
    avatarUrl?: string;
  };
  message?: string;
  createdAt: string;
  updatedAt: string;
}
