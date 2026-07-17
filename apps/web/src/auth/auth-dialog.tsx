import { type FormEvent, useEffect, useState } from "react";
import { Building2, LoaderCircle, LockKeyhole, Mail, User, X } from "lucide-react";
import { ApiRequestError } from "../lib/api";
import { useAuth } from "./auth-context";

export type AuthMode = "login" | "register";

interface AuthDialogProps {
  mode: AuthMode;
  open: boolean;
  onModeChange(mode: AuthMode): void;
  onOpenChange(open: boolean): void;
}

export function AuthDialog({ mode, open, onModeChange, onOpenChange }: AuthDialogProps) {
  const { login, register } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => setError(null), [mode, open]);
  if (!open) return null;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    const values = new FormData(event.currentTarget);

    try {
      if (mode === "login") {
        await login({
          email: String(values.get("email")),
          password: String(values.get("password")),
        });
      } else {
        await register({
          name: String(values.get("name")),
          email: String(values.get("email")),
          password: String(values.get("password")),
          organizationName: String(values.get("organizationName")),
        });
      }
      onOpenChange(false);
    } catch (requestError) {
      setError(
        requestError instanceof ApiRequestError
          ? requestError.message
          : "The API could not complete this request",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
      <button
        aria-label="Close authentication dialog"
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-title"
        className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#0b0b0d] p-7 text-white shadow-2xl"
      >
        <button
          aria-label="Close"
          className="absolute right-5 top-5 rounded-full border border-white/10 p-2 text-slate-400 hover:text-white"
          onClick={() => onOpenChange(false)}
        >
          <X size={16} />
        </button>

        <div className="mb-7">
          <div className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-blue-400">
            Backend connected
          </div>
          <h2 id="auth-title" className="text-3xl font-black tracking-tight">
            {mode === "login" ? "Welcome back" : "Create your workspace"}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            {mode === "login"
              ? "Sign in securely to continue to RecruiterAI OS."
              : "Your first account becomes the workspace administrator."}
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {mode === "register" && (
            <>
              <AuthInput icon={User} label="Full name" name="name" autoComplete="name" />
              <AuthInput
                icon={Building2}
                label="Organization"
                name="organizationName"
                autoComplete="organization"
              />
            </>
          )}
          <AuthInput icon={Mail} label="Email" name="email" type="email" autoComplete="email" />
          <AuthInput
            icon={LockKeyhole}
            label="Password"
            name="password"
            type="password"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            minLength={mode === "register" ? 12 : undefined}
          />

          {error && (
            <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <button
            disabled={submitting}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 font-bold transition hover:bg-blue-500 disabled:cursor-wait disabled:opacity-60"
          >
            {submitting && <LoaderCircle className="animate-spin" size={17} />}
            {mode === "login" ? "Log in" : "Create account"}
          </button>
        </form>

        <button
          className="mt-5 w-full text-center text-sm text-slate-400 hover:text-white"
          onClick={() => onModeChange(mode === "login" ? "register" : "login")}
        >
          {mode === "login" ? "Need an account? Create one" : "Already registered? Log in"}
        </button>
      </div>
    </div>
  );
}

interface AuthInputProps {
  autoComplete: string;
  icon: typeof User;
  label: string;
  minLength?: number;
  name: string;
  type?: string;
}

function AuthInput({
  autoComplete,
  icon: Icon,
  label,
  minLength,
  name,
  type = "text",
}: AuthInputProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
        {label}
      </span>
      <span className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 focus-within:border-blue-500/70">
        <Icon size={17} className="text-slate-500" />
        <input
          required
          autoComplete={autoComplete}
          minLength={minLength}
          name={name}
          type={type}
          className="h-12 w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
        />
      </span>
    </label>
  );
}
