
export type User = {
  id: string;
  username: string;
  role: "admin" | "customer";
};

export type AuthContextType = {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  signup: (username: string, password: string, role: "admin" | "customer", displayName?: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: () => boolean;
  isCustomer: () => boolean;
};
