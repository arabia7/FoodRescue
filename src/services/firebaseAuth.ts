
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User as FirebaseUser
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { User } from "@/types/auth";
import { toast } from "sonner";

export const firebaseLogin = async (
  username: string, 
  password: string
): Promise<User | null> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, username, password);
    const firebaseUser = userCredential.user;
    
    // Get user role from localStorage (in a real app, you'd get this from a database)
    const role = localStorage.getItem(`user_role_${firebaseUser.uid}`) as "admin" | "customer" || "customer";
    
    const userObj = {
      id: firebaseUser.uid,
      username: firebaseUser.displayName || username,
      role: role
    };
    
    toast.success(`Welcome back, ${userObj.username}!`);
    return userObj;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Login failed";
    toast.error(errorMessage);
    return null;
  }
};

export const firebaseSignup = async (
  username: string, 
  password: string, 
  role: "admin" | "customer",
  displayName?: string
): Promise<User | null> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, username, password);
    const firebaseUser = userCredential.user;
    
    // Store the role in localStorage (in a real app, you'd store this in a database)
    localStorage.setItem(`user_role_${firebaseUser.uid}`, role);
    
    // Set display name if provided
    if (displayName) {
      await updateProfile(firebaseUser, {
        displayName: displayName
      });
    }
    
    const userObj = {
      id: firebaseUser.uid,
      username: displayName || username,
      role: role
    };
    
    toast.success(`Account created successfully. Welcome, ${displayName || username}!`);
    return userObj;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Signup failed";
    toast.error(errorMessage);
    return null;
  }
};

export const firebaseLogout = async (): Promise<boolean> => {
  try {
    await signOut(auth);
    toast.success("Logged out successfully");
    return true;
  } catch (error) {
    toast.error("Logout failed");
    return false;
  }
};

export const isFirebaseConfigured = (): boolean => {
  try {
    return auth.app.options.apiKey !== undefined && 
      auth.app.options.apiKey !== "YOUR_API_KEY";
  } catch (err) {
    return false;
  }
};
