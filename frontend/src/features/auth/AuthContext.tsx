import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
  useEffect,
} from "react";
import { setAuthToken } from "@/services/api";
import {
  clearStoredSession,
  loadSession,
  persistSession,
  type StoredSession,
} from "@/services/storage";
import { type SessionUser, type UserRole } from "./types";

type AuthState = {
  user: SessionUser | null;
  token: string | null;
  hydrated: boolean;
};

type AuthContextValue = {
  user: SessionUser | null;
  token: string | null;
  isAuthenticated: boolean;
  hydrated: boolean;
  setSession: (payload: { user: SessionUser; token: string }) => void;
  clearSession: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    hydrated: false,
  });

  useEffect(() => {
    const stored = loadSession();
    const validRoles: UserRole[] = ["ADMIN", "MANAGER", "MEMBER"];
    const roleIsValid = stored?.user?.role
      ? validRoles.includes(stored.user.role as UserRole)
      : false;

    if (stored?.token && stored.user && roleIsValid) {
      setAuthToken(stored.token);
      setState({
        user: stored.user,
        token: stored.token,
        hydrated: true,
      });
      return;
    }

    setState((prev) => ({ ...prev, hydrated: true }));
  }, []);

  const persist = (session: StoredSession | null) => {
    if (session) {
      persistSession(session);
      setAuthToken(session.token);
    } else {
      clearStoredSession();
      setAuthToken(null);
    }
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user: state.user,
      token: state.token,
      hydrated: state.hydrated,
      isAuthenticated: Boolean(state.token && state.user),
      setSession: ({ user, token }) => {
        setState({ user, token, hydrated: true });
        persist({ user, token });
      },
      clearSession: () => {
        setState({ user: null, token: null, hydrated: true });
        persist(null);
      },
      logout: () => {
        setState({ user: null, token: null, hydrated: true });
        persist(null);
      },
    }),
    [state],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
