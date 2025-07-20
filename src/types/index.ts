export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
}

export interface Photo {
  id: string;
  userId: string;
  filename: string;
  dataUrl: string;
  uploadedAt: Date;
  comments: Comment[];
}

export interface Comment {
  id: string;
  photoId: string;
  userId: string;
  text: string;
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}