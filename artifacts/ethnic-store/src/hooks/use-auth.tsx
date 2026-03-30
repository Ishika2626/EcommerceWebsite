import { createContext, useContext, ReactNode, useEffect, useState } from "react";
import { useGetMe, User, useLogout } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [_, setLocation] = useLocation();
  const queryClient = useQueryClient();
  
  const { data: user, isLoading, isError } = useGetMe({
    query: {
      retry: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    }
  });

  const logoutMutation = useLogout({
    mutation: {
      onSuccess: () => {
        queryClient.setQueryData([`/api/auth/me`], null);
        queryClient.invalidateQueries({ queryKey: [`/api/cart`] });
        setLocation("/login");
      }
    }
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const value = {
    user: isError ? null : (user ?? null),
    isLoading,
    isAuthenticated: !!user && !isError,
    isAdmin: user?.role === "admin",
    logout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
