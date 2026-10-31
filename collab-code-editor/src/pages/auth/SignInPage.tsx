import { useState, type FormEvent } from "react";
import AuthLayout from "../../components/auth/AuthLayout";
import AuthCard from "../../components/auth/AuthCard";
import TextField from "../../components/auth/TextField";
import Divider from "../../components/auth/Divider";
import SocialButton, {
  GoogleIcon,
  GitHubIcon,
} from "../../components/auth/SocialButton";
import styles from "./SignInPage.module.css";

interface SignInPageProps {
  onSignInSuccess: (userData: any) => void;
  onNavigateSignUp: () => void;
  showToast: (message: string, variant?: any) => void;
}

interface Errors {
  email?: string;
  password?: string;
}

function SignInPage({ onSignInSuccess, onNavigateSignUp, showToast }: SignInPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = (): Errors => {
    const next: Errors = {};
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      next.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      next.email = "Enter a valid email address.";
    }
    if (!password) {
      next.password = "Password is required.";
    } else if (password.length < 6) {
      next.password = "Password must be at least 6 characters.";
    }
    return next;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Store token for future requests
      localStorage.setItem("collabcode_token", data.token);
      localStorage.setItem("collabcode_user", JSON.stringify(data.user));

      showToast("Welcome back!", "success");
      onSignInSuccess(data.user);
    } catch (err: any) {
      showToast(err.message, "warning");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <AuthCard
        title="Welcome back"
        subtitle="Sign in to jump back into your coding rooms."
        footer={
          <>
            Don&apos;t have an account?{" "}
            <a
              href="#"
              className={styles.footerLink}
              onClick={(e) => {
                e.preventDefault();
                onNavigateSignUp?.();
              }}
            >
              Sign up
            </a>
          </>
        }
      >
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <TextField
            label="Email"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            leadingIcon={<MailIcon />}
          />

          <TextField
            label="Password"
            name="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            isPassword
            leadingIcon={<LockIcon />}
          />

          <div className={styles.row}>
            <label className={styles.remember}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <span className={styles.checkboxBox} aria-hidden="true">
                <CheckIcon />
              </span>
              <span>Remember me</span>
            </label>

            <a href="#" className={styles.forgot}>
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className={styles.submit}
            disabled={submitting}
          >
            {submitting ? (
              <span className={styles.spinner} aria-hidden="true" />
            ) : (
              <>
                Sign in
                <ArrowIcon />
              </>
            )}
          </button>
        </form>

        <div className={styles.dividerBlock}>
          <Divider label="or" />
        </div>

        <div className={styles.socialRow}>
          <SocialButton icon={<GoogleIcon />}>Continue with Google</SocialButton>
          <SocialButton icon={<GitHubIcon />}>Continue with GitHub</SocialButton>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}

function MailIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0,0 24,24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export default SignInPage;
