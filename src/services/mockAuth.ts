
import { User } from "@/types/auth";
import { toast } from "sonner";

// Mock users for fallback when Firebase isn't configured
export const mockUsers = [
  { id: "1", username: "admin", password: "admin123", role: "admin" as const },
  { id: "2", username: "customer", password: "customer123", role: "customer" as const },
];

export const mockLogin = async (
  users: any[],
  username: string,
  password: string
): Promise<User | null> => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  
  const foundUser = users.find(
    (u) => u.username === username && u.password === password
  );
  
  if (foundUser) {
    const { password, ...userWithoutPassword } = foundUser;
    localStorage.setItem("user", JSON.stringify(userWithoutPassword));
    toast.success(`Welcome back, ${username}!`);
    return userWithoutPassword as User;
  } else {
    toast.error("Invalid username or password");
    return null;
  }
};

export const mockSignup = async (
  users: any[],
  username: string,
  password: string,
  role: "admin" | "customer",
  displayName?: string
): Promise<{ user: User | null; updatedUsers: any[] }> => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  
  // Check if username already exists
  const existingUser = users.find((u) => u.username === username);
  if (existingUser) {
    toast.error("Username already exists");
    return { user: null, updatedUsers: users };
  }
  
  // Create new user
  const newUser = {
    id: (users.length + 1).toString(),
    username: displayName || username,
    password,
    role,
  };
  
  // Add to users array
  const updatedUsers = [...users, newUser];
  
  // Log in the new user
  const { password: _, ...userWithoutPassword } = newUser;
  localStorage.setItem("user", JSON.stringify(userWithoutPassword));
  
  toast.success(`Account created successfully. Welcome, ${displayName || username}!`);
  return { user: userWithoutPassword as User, updatedUsers };
};

export const mockLogout = (): void => {
  localStorage.removeItem("user");
  toast.success("Logged out successfully");
};
