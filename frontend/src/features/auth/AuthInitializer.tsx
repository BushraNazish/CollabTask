import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./AuthContext";
import { fetchMe } from "./api";
import { normalizeError } from "@/services/errors";
import { useToast } from "@/components/ui/ToastProvider";

function AuthInitializer() {
  const { token, user, setSession, clearSession } = useAuth();
  const { addToast } = useToast();

  const { data, error } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: fetchMe,
    enabled: Boolean(token),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  useEffect(() => {
    if (!token || !data) return;
    const sameUser =
      user?.email === data.email &&
      user?.role === data.role &&
      user?.id === data.id;
    if (sameUser) return;
    setSession({ user: { ...data }, token });
  }, [data, token, user, setSession]);

  useEffect(() => {
    if (!token || !error) return;
    const normalized = normalizeError(error);
    addToast({
      title: normalized.title,
      description: "Session expired. Please sign in again.",
      variant: "error",
    });
    clearSession();
  }, [error, addToast, clearSession, token]);

  // Avoid flashing logout while auth is hydrated by keeping previous user if present
  return null;
}

export default AuthInitializer;
