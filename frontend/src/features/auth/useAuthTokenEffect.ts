import { useEffect } from "react";
import { setAuthToken } from "@/services/api";
import { useAuth } from "./AuthContext";

export function useAuthTokenEffect() {
  const { token } = useAuth();

  useEffect(() => {
    setAuthToken(token);
  }, [token]);
}
