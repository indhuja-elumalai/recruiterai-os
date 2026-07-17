import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type {
  AuthResponse,
  AuthUser,
  LoginRequest,
  MessageResponse,
  RegisterRequest,
} from "@recruiterai/contracts";
import { apiRequest } from "../lib/api";

interface AuthContextValue {
  accessToken: string | null;
  isLoading: boolean;
  user: AuthUser | null;
  login(input: LoginRequest): Promise<void>;
  logout(): Promise<void>;
  register(input: RegisterRequest): Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const applySession = useCallback((response: AuthResponse) => {
    setUser(response.data.user);
    setAccessToken(response.data.accessToken);
  }, []);

  const refreshSession = useCallback(async () => {
    const response = await apiRequest<AuthResponse>("/auth/refresh", { method: "POST" });
    applySession(response);
  }, [applySession]);

  useEffect(() => {
    let active = true;
    refreshSession()
      .catch(() => undefined)
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [refreshSession]);

  useEffect(() => {
    if (!user) return;
    const refresh = () => {
      void refreshSession().catch(() => {
        setUser(null);
        setAccessToken(null);
      });
    };
    const interval = window.setInterval(refresh, 12 * 60 * 1_000);
    const handleVisibility = () => {
      if (document.visibilityState === "visible") refresh();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [refreshSession, user]);

  const login = useCallback(
    async (input: LoginRequest) => {
      const response = await apiRequest<AuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify(input),
      });
      applySession(response);
    },
    [applySession],
  );

  const register = useCallback(
    async (input: RegisterRequest) => {
      const response = await apiRequest<AuthResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify(input),
      });
      applySession(response);
    },
    [applySession],
  );

  const logout = useCallback(async () => {
    await apiRequest<MessageResponse>("/auth/logout", { method: "POST" });
    setUser(null);
    setAccessToken(null);
  }, []);

  const value = useMemo(
    () => ({ accessToken, isLoading, user, login, logout, register }),
    [accessToken, isLoading, login, logout, register, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
