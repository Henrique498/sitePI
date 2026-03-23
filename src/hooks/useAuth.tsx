/* eslint-disable react-refresh/only-export-components */
import { useState, createContext, useContext, type ReactNode } from "react";
import type { User } from "@/types";

// Criamos um tipo para representar o usuário no localStorage (que ainda tem a senha)
interface UserWithPassword extends User {
  password?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    name: string,
    email: string,
    password: string,
    phone?: string,
  ) => Promise<boolean>;
  loginWithGoogle: (googleData: any) => Promise<boolean>;
  logout: () => void;
  addToFavorites: (dogId: string) => void;
  removeFromFavorites: (dogId: string) => void;
  isFavorite: (dogId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("petconnectta_user");
      return storedUser ? JSON.parse(storedUser) : null;
    }
    return null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return !!localStorage.getItem("petconnectta_user");
    }
    return false;
  });

  const login = async (email: string, password: string): Promise<boolean> => {
    const users: UserWithPassword[] = JSON.parse(
      localStorage.getItem("petconnectta_users") || "[]",
    );
    const foundUser = users.find(
      (u) => u.email === email && u.password === password,
    );

    if (foundUser) {
      // Para remover o password sem gerar erro de unused var, deletamos a propriedade
      const userCopy = { ...foundUser };
      delete userCopy.password;

      setUser(userCopy as User);
      setIsAuthenticated(true);
      localStorage.setItem("petconnectta_user", JSON.stringify(userCopy));
      return true;
    }
    return false;
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    phone?: string,
  ): Promise<boolean> => {
    const users: UserWithPassword[] = JSON.parse(
      localStorage.getItem("petconnectta_users") || "[]",
    );

    if (users.find((u) => u.email === email)) {
      return false;
    }

    const newUser: UserWithPassword = {
      id: Date.now().toString(),
      name,
      email,
      password,
      phone,
      favorites: [],
    };

    users.push(newUser);
    localStorage.setItem("petconnectta_users", JSON.stringify(users));

    const userCopy = { ...newUser };
    delete userCopy.password;

    setUser(userCopy as User);
    setIsAuthenticated(true);
    localStorage.setItem("petconnectta_user", JSON.stringify(userCopy));

    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("petconnectta_user");
  };

  const loginWithGoogle = async (googleData: any): Promise<boolean> => {
    try {
      // Decodifica o JWT token do Google
      const base64Url = googleData.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      
      const decodedToken = JSON.parse(jsonPayload);
      
      // Extrai dados do Google
      const { email, name, picture } = decodedToken;
      
      // Verifica se o usuário já existe
      let users: UserWithPassword[] = JSON.parse(
        localStorage.getItem("petconnectta_users") || "[]",
      );
      
      let foundUser = users.find((u) => u.email === email);
      
      if (!foundUser) {
        // Cria novo usuário com dados do Google
        foundUser = {
          id: Date.now().toString(),
          name,
          email,
          photoUrl: picture,
          favorites: [],
        };
        
        users.push(foundUser);
        localStorage.setItem("petconnectta_users", JSON.stringify(users));
      } else if (!foundUser.photoUrl && picture) {
        // Atualiza foto se o usuário não tinha
        foundUser.photoUrl = picture;
        const userIndex = users.findIndex((u) => u.id === foundUser!.id);
        if (userIndex !== -1) {
          users[userIndex] = foundUser;
          localStorage.setItem("petconnectta_users", JSON.stringify(users));
        }
      }
      
      const userCopy = { ...foundUser };
      delete userCopy.password;
      
      setUser(userCopy as User);
      setIsAuthenticated(true);
      localStorage.setItem("petconnectta_user", JSON.stringify(userCopy));
      
      return true;
    } catch (error) {
      console.error("Erro ao fazer login com Google:", error);
      return false;
    }
  };

  const addToFavorites = (dogId: string) => {
    if (!user) return;

    const updatedFavorites = [...user.favorites, dogId];
    const updatedUser = { ...user, favorites: updatedFavorites };

    setUser(updatedUser);
    localStorage.setItem("petconnectta_user", JSON.stringify(updatedUser));

    const users: UserWithPassword[] = JSON.parse(
      localStorage.getItem("petconnectta_users") || "[]",
    );
    const userIndex = users.findIndex((u) => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex].favorites = updatedFavorites;
      localStorage.setItem("petconnectta_users", JSON.stringify(users));
    }
  };

  const removeFromFavorites = (dogId: string) => {
    if (!user) return;

    const updatedFavorites = user.favorites.filter((id) => id !== dogId);
    const updatedUser = { ...user, favorites: updatedFavorites };

    setUser(updatedUser);
    localStorage.setItem("petconnectta_user", JSON.stringify(updatedUser));

    const users: UserWithPassword[] = JSON.parse(
      localStorage.getItem("petconnectta_users") || "[]",
    );
    const userIndex = users.findIndex((u) => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex].favorites = updatedFavorites;
      localStorage.setItem("petconnectta_users", JSON.stringify(users));
    }
  };

  const isFavorite = (dogId: string) => {
    return user?.favorites.includes(dogId) || false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        register,
        loginWithGoogle,
        logout,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
