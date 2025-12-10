import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { register as registerUser } from "@/features/auth/api";
import { useAuth } from "@/features/auth/AuthContext";
import { type UserRole } from "@/features/auth/types";
import { useToast } from "@/components/ui/ToastProvider";
import { normalizeError } from "@/services/errors";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*/,
      "Must include upper, lower, and a number",
    ),
  role: z.enum(["ADMIN", "MANAGER", "MEMBER"]),
});

type FormValues = z.infer<typeof schema>;

function Register() {
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const { addToast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "MEMBER",
    },
  });

  const { mutateAsync, isPending, isError, error } = useMutation({
    mutationFn: registerUser,
    onSuccess: (session) => {
      setSession(session);
      addToast({
        title: "Account created",
        description: "You are now signed in.",
        variant: "success",
      });
      navigate("/", { replace: true });
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
        <h2 className="text-xl font-semibold text-ink-900">Create account</h2>
        <p className="text-sm text-ink-600">
          Set up your workspace credentials.
        </p>
      </div>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <label className="text-sm font-medium text-ink-800" htmlFor="name">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            className="w-full rounded-lg border border-surface-200 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            placeholder="Alex Doe"
            {...form.register("name")}
          />
          {form.formState.errors.name && (
            <p className="text-xs text-red-600">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-ink-800" htmlFor="email">
            Email <span className="text-red-500">*</span>
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
            Password <span className="text-red-500">*</span>
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
        <div className="space-y-2">
          <label className="text-sm font-medium text-ink-800" htmlFor="role">
            Role <span className="text-red-500">*</span>
          </label>
          <select
            id="role"
            className="w-full rounded-lg border border-surface-200 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            {...form.register("role")}
          >
            {(["ADMIN", "MANAGER", "MEMBER"] as UserRole[]).map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
          {form.formState.errors.role && (
            <p className="text-xs text-red-600">
              {form.formState.errors.role.message}
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
          {isPending ? "Creating account..." : "Create account"}
        </button>
      </form>
      <p className="text-sm text-ink-600">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-brand-700">
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default Register;
