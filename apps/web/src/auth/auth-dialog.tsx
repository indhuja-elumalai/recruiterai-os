import { type FormEvent, useEffect, useState } from "react";
import {
  Building2,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
  ShieldCheck,
  User,
  X,
  Zap,
} from "lucide-react";
import { ApiRequestError, apiRequest } from "../lib/api";
import type { MessageResponse } from "@recruiterai/contracts";
import { useAuth } from "./auth-context";
import "./auth-dialog.css";

export type AuthMode = "login" | "register" | "reset";

interface AuthDialogProps {
  mode: AuthMode;
  open: boolean;
  onModeChange(mode: AuthMode): void;
  onOpenChange(open: boolean): void;
}

export function AuthDialog({ mode, open, onModeChange, onOpenChange }: AuthDialogProps) {
  const { login, register } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => setError(null), [mode, open]);
  useEffect(() => {
    if (!open) setNotice(null);
  }, [open]);
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
      } else if (mode === "register") {
        await register({
          name: String(values.get("name")),
          email: String(values.get("email")),
          password: String(values.get("password")),
          organizationName: String(values.get("organizationName")),
        });
        onOpenChange(false);
      } else {
        const newPassword = String(values.get("newPassword"));
        if (newPassword !== String(values.get("confirmPassword"))) {
          setError("Passwords do not match");
          return;
        }

        const response = await apiRequest<MessageResponse>("/auth/development/reset-password", {
          method: "POST",
          body: JSON.stringify({
            email: String(values.get("email")),
            newPassword,
          }),
        });
        onModeChange("login");
        setNotice(response.data.message);
      }
      if (mode === "login") onOpenChange(false);
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
    <div className="auth-modal">
      <button
        aria-label="Close authentication dialog"
        className="auth-modal__backdrop"
        onClick={() => onOpenChange(false)}
      />
      <div role="dialog" aria-modal="true" aria-labelledby="auth-title" className="auth-card">
        <div className="auth-card__accent" />
        <button aria-label="Close" className="auth-card__close" onClick={() => onOpenChange(false)}>
          <X size={15} />
        </button>

        <div className="auth-brand">
          <div className="auth-brand__logo">
            <Zap size={16} fill="currentColor" />
          </div>
          <div>
            <div className="auth-brand__name">
              Recruiter<span className="text-blue-500">AI</span>
            </div>
            <div className="auth-brand__secure">
              <ShieldCheck size={10} className="text-blue-500" /> Secure workspace
            </div>
          </div>
        </div>

        <div className="auth-card__header">
          <h2 id="auth-title">
            {mode === "login"
              ? "Welcome back"
              : mode === "register"
                ? "Create your workspace"
                : "Reset your password"}
          </h2>
          <p>
            {mode === "login"
              ? "Sign in to manage your hiring workspace."
              : mode === "register"
                ? "Your first account will be the workspace administrator."
                : "Set a new local-development password for your account."}
          </p>
        </div>

        {mode === "reset" ? (
          <button className="auth-back" type="button" onClick={() => onModeChange("login")}>
            Back to login
          </button>
        ) : (
          <div className="auth-tabs">
            {(["login", "register"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => onModeChange(tab)}
                className={`auth-tabs__button ${mode === tab ? "auth-tabs__button--active" : ""}`}
              >
                {tab === "login" ? "Log in" : "Create account"}
              </button>
            ))}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
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
          {mode === "reset" ? (
            <>
              <AuthInput
                icon={LockKeyhole}
                label="New password"
                name="newPassword"
                type="password"
                autoComplete="new-password"
                minLength={12}
              />
              <AuthInput
                icon={LockKeyhole}
                label="Confirm password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                minLength={12}
              />
            </>
          ) : (
            <AuthInput
              icon={LockKeyhole}
              label="Password"
              name="password"
              type="password"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              minLength={mode === "register" ? 12 : undefined}
            />
          )}
          {mode === "register" && <p className="auth-form__hint">Use at least 12 characters.</p>}
          {mode === "login" && (
            <div className="auth-form__helper-row">
              <span>Use your workspace password.</span>
              {import.meta.env.DEV && (
                <button type="button" onClick={() => onModeChange("reset")}>
                  Reset password
                </button>
              )}
            </div>
          )}
          {mode === "reset" && (
            <p className="auth-form__hint auth-form__hint--warning">
              Local development only. OTP verification will replace this before production.
            </p>
          )}

          {error && <div className="auth-form__error">{error}</div>}
          {notice && <div className="auth-form__notice">{notice}</div>}

          <button disabled={submitting} className="auth-form__submit">
            {submitting && <LoaderCircle className="auth-form__spinner" size={17} />}
            {mode === "login"
              ? "Log in"
              : mode === "register"
                ? "Create account"
                : "Reset password"}
          </button>
        </form>

        <p className="auth-card__footer">
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
  const [passwordVisible, setPasswordVisible] = useState(false);
  const isPassword = type === "password";
  const inputId = `auth-${name}`;

  return (
    <div className="auth-field">
      <label className="auth-field__label" htmlFor={inputId}>
        {label}
      </label>
      <span className="auth-field__control">
        <Icon size={15} />
        <input
          required
          autoComplete={autoComplete}
          id={inputId}
          minLength={minLength}
          name={name}
          type={isPassword && passwordVisible ? "text" : type}
          className="auth-field__input"
        />
        {isPassword && (
          <button
            aria-label={
              passwordVisible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`
            }
            className="auth-field__visibility"
            type="button"
            onClick={() => setPasswordVisible((visible) => !visible)}
          >
            {passwordVisible ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </span>
    </div>
  );
}
