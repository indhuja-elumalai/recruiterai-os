import { type FormEvent, useEffect, useState } from "react";
import {
  Building2,
  LoaderCircle,
  LockKeyhole,
  Mail,
  ShieldCheck,
  User,
  X,
  Zap,
} from "lucide-react";
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
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
      <button
        aria-label="Close authentication dialog"
        className="absolute inset-0 cursor-default bg-[#020202]/90"
        onClick={() => onOpenChange(false)}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-title"
        className="relative max-h-[calc(100dvh-2rem)] w-full max-w-[390px] overflow-y-auto rounded-[1.75rem] border border-blue-500/20 bg-[#08090c] p-5 text-white shadow-[0_30px_100px_rgba(0,0,0,0.8),0_0_45px_rgba(37,99,235,0.10)] sm:p-6"
      >
        <div className="absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
        <button
          aria-label="Close"
          className="absolute right-4 top-4 rounded-full border border-white/10 bg-[#11131a] p-2 text-slate-500 transition hover:border-white/20 hover:text-white"
          onClick={() => onOpenChange(false)}
        >
          <X size={15} />
        </button>

        <div className="mb-5 flex items-center gap-2.5">
          <div className="relative flex size-9 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.28)]">
            <Zap className="size-4 fill-current" />
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight">
              Recruiter<span className="text-blue-500">AI</span>
            </div>
            <div className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500">
              <ShieldCheck size={10} className="text-blue-500" /> Secure workspace
            </div>
          </div>
        </div>

        <div className="mb-5">
          <h2 id="auth-title" className="text-2xl font-black tracking-[-0.03em]">
            {mode === "login" ? "Welcome back" : "Create your workspace"}
          </h2>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
            {mode === "login"
              ? "Sign in to manage your hiring workspace."
              : "Your first account will be the workspace administrator."}
          </p>
        </div>

        <div className="mb-5 grid grid-cols-2 rounded-xl border border-white/[0.07] bg-[#0d0f14] p-1">
          {(["login", "register"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => onModeChange(tab)}
              className={`h-9 rounded-lg text-xs font-bold transition ${
                mode === tab
                  ? "bg-blue-600 text-white shadow-[0_5px_16px_rgba(37,99,235,0.24)]"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {tab === "login" ? "Log in" : "Create account"}
            </button>
          ))}
        </div>

        <form className="space-y-3.5" onSubmit={handleSubmit}>
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
          {mode === "register" && (
            <p className="-mt-1 text-[10px] text-slate-600">Use at least 12 characters.</p>
          )}

          {error && (
            <div className="rounded-xl border border-red-400/20 bg-[#211014] px-3.5 py-2.5 text-xs text-red-300">
              {error}
            </div>
          )}

          <button
            disabled={submitting}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-bold shadow-[0_10px_28px_rgba(37,99,235,0.22)] transition hover:bg-blue-500 disabled:cursor-wait disabled:opacity-60"
          >
            {submitting && <LoaderCircle className="animate-spin" size={17} />}
            {mode === "login" ? "Log in" : "Create account"}
          </button>
        </form>

        <p className="mt-4 text-center text-[10px] leading-relaxed text-slate-600">
          Protected by encrypted credentials and secure session cookies.
        </p>
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
      <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
        {label}
      </span>
      <span className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-[#0d1017] px-3.5 transition focus-within:border-blue-500/70 focus-within:bg-[#10141d] focus-within:ring-2 focus-within:ring-blue-500/10">
        <Icon size={15} className="text-slate-600" />
        <input
          required
          autoComplete={autoComplete}
          minLength={minLength}
          name={name}
          type={type}
          className="h-11 w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-700"
        />
      </span>
    </label>
  );
}
