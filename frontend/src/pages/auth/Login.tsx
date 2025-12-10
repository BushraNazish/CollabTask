import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { login } from "@/features/auth/api";
import { useAuth } from "@/features/auth/AuthContext";
import { useToast } from "@/components/ui/ToastProvider";
import { normalizeError } from "@/services/errors";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormValues = z.infer<typeof schema>;

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setSession } = useAuth();
  const { addToast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const { mutateAsync, isPending, isError, error } = useMutation({
    mutationFn: login,
    onSuccess: (session) => {
      setSession(session);
      addToast({
        title: "Signed in",
        description: "Welcome back!",
        variant: "success",
      });
      const redirectTo =
        (location.state as { from?: { pathname?: string } })?.from?.pathname ||
        "/";
      navigate(redirectTo, { replace: true });
    },
    onError: (err) => {
      const normalized = normalizeError(err);
      addToast({
        title: normalized.title,
        description: normalized.message,
        variant: "error",
      });
    },
  });

  const onSubmit = async (values: FormValues) => {
    await mutateAsync(values);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-ink-900">Sign in</h2>
        <p className="text-sm text-ink-600">
          Use your CollabTask credentials to continue.
        </p>
      </div>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <label className="text-sm font-medium text-ink-800" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="w-full rounded-lg border border-surface-200 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            placeholder="you@example.com"
            {...form.register("email")}
          />
          {form.formState.errors.email && (
            <p className="text-xs text-red-600">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <label
            className="text-sm font-medium text-ink-800"
            htmlFor="password"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            className="w-full rounded-lg border border-surface-200 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            placeholder="••••••••"
            {...form.register("password")}
          />
          {form.formState.errors.password && (
            <p className="text-xs text-red-600">
              {form.formState.errors.password.message}
            </p>
          )}
        </div>
        {isError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            {normalizeError(error).message}
          </div>
        )}
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-lg bg-ink-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-ink-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPending ? "Signing in..." : "Sign in"}
        </button>
      </form>
      <p className="text-sm text-ink-600">
        Don&apos;t have an account?{" "}
        <Link to="/register" className="font-semibold text-brand-700">
          Register
        </Link>
      </p>
    </div>
  );
}

export default Login;
