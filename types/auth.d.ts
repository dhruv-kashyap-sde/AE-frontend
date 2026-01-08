// User type definition for authentication
export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  avatar?: string;
  isEmailVerified?: boolean;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (userData: User) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}
