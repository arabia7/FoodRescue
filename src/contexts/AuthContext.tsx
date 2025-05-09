
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { User, AuthContextType } from "@/types/auth";
import { 
  mockUsers, 
  mockLogin, 
  mockSignup, 
  mockLogout 
} from "@/services/mockAuth";
import {
  firebaseLogin,
  firebaseSignup,
  firebaseLogout,
  isFirebaseConfigured
} from "@/services/firebaseAuth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseAvailable, setFirebaseAvailable] = useState(false);
  
 
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem("users");
    return savedUsers ? JSON.parse(savedUsers) : mockUsers;
  });


  const saveUsers = (updatedUsers: typeof users) => {
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
  };

  useEffect(() => {
   
    const firebaseConfigured = isFirebaseConfigured();
    setFirebaseAvailable(firebaseConfigured);
    
    if (firebaseConfigured) {
      
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          
          const role = localStorage.getItem(`user_role_${firebaseUser.uid}`) as "admin" | "customer" || "customer";
          
          setUser({
            id: firebaseUser.uid,
            username: firebaseUser.displayName || firebaseUser.email || "User",
            role: role
          });
        } else {
          setUser(null);
        }
      });
      
      
      return () => unsubscribe();
    } else {
      
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    }
  }, []);

  const login = async (username: string, password: string) => {
    if (firebaseAvailable) {
      const userObj = await firebaseLogin(username, password);
      if (userObj) {
        setUser(userObj);
        return true;
      }
      return false;
    } else {
      const userObj = await mockLogin(users, username, password);
      if (userObj) {
        setUser(userObj);
        return true;
      }
      return false;
    }
  };

  const signup = async (username: string, password: string, role: "admin" | "customer", displayName?: string) => {
    if (firebaseAvailable) {
      const userObj = await firebaseSignup(username, password, role, displayName);
      if (userObj) {
        setUser(userObj);
        return true;
      }
      return false;
    } else {
      const result = await mockSignup(users, username, password, role, displayName);
      if (result.user) {
        setUser(result.user);
        saveUsers(result.updatedUsers);
        return true;
      }
      return false;
    }
  };

  const logout = () => {
    if (firebaseAvailable) {
      firebaseLogout().then(() => {
        setUser(null);
      });
    } else {
      mockLogout();
      setUser(null);
    }
  };

  const isAdmin = () => user?.role === "admin";
  const isCustomer = () => user?.role === "customer";

  return (
    <AuthContext.Provider value={{ user, login, logout, signup, isAdmin, isCustomer }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
