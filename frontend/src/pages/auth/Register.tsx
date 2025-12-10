import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
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
  const [showPassword, setShowPassword] = useState(false);

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
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-1 text-center lg:text-left">
        <h2 className="text-2xl font-display font-bold tracking-tight text-ink-900">Create account</h2>
        <p className="text-sm text-ink-500">
          Get started with your free workspace today.
        </p>
      </div>

      <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-ink-700" htmlFor="name">
            Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="name"
              type="text"
              className="w-full rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 transition-all shadow-sm"
              placeholder="Full Name"
              {...form.register("name")}
            />
          </div>
          {form.formState.errors.name && (
            <p className="text-xs font-medium text-red-600 animate-in slide-in-from-left-1">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-ink-700" htmlFor="email">
            Email <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="email"
              type="email"
              className="w-full rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 transition-all shadow-sm"
              placeholder="name@company.com"
              {...form.register("email")}
            />
          </div>
          {form.formState.errors.email && (
            <p className="text-xs font-medium text-red-600 animate-in slide-in-from-left-1">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label
            className="text-xs font-semibold text-ink-700"
            htmlFor="password"
          >
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              className="w-full rounded-lg border border-surface-300 bg-white px-3 py-2 pr-10 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 transition-all shadow-sm"
              placeholder="At least 8 characters"
              {...form.register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-ink-400 hover:bg-surface-100 hover:text-ink-600 transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {form.formState.errors.password && (
            <p className="text-xs font-medium text-red-600 animate-in slide-in-from-left-1">
              {form.formState.errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-ink-700" htmlFor="role">
            Role <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              id="role"
              className="w-full appearance-none rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm text-ink-900 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 transition-all shadow-sm"
              {...form.register("role")}
            >
              {(["ADMIN", "MANAGER", "MEMBER"] as UserRole[]).map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
          {form.formState.errors.role && (
            <p className="text-xs font-medium text-red-600 animate-in slide-in-from-left-1">
              {form.formState.errors.role.message}
            </p>
          )}
        </div>

        {isError && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-2 text-xs font-medium text-red-600 animate-in shake">
            {normalizeError(error).message}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="relative w-full overflow-hidden rounded-lg bg-gradient-to-br from-brand-600 to-brand-700 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand-500/25 transition-all hover:to-brand-800 hover:shadow-brand-500/40 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 group"
        >
          {isPending ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating account...
            </span>
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-surface-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-ink-400">
            Already have an account?
          </span>
        </div>
      </div>

      <div className="text-center">
        <Link
          to="/login"
          className="inline-flex items-center gap-1 text-sm font-semibold text-ink-900 hover:text-brand-600 transition-colors"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}

export default Register;
