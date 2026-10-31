import { useState } from "react";
import Button from "../components/Button";
import type { ToastVariant } from "../components/Toast";
import styles from "./SignUp.module.css";

interface SignUpProps {
  onSignUpSuccess: () => void;
  showToast: (message: string, variant?: ToastVariant) => void;
}

function SignUp({ onSignUpSuccess, showToast }: SignUpProps) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      showToast("Passwords do not match", "warning");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      showToast("Account created successfully!", "success");
      onSignUpSuccess();
    } catch (err: any) {
      showToast(err.message, "warning");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Create Account</h1>
        <p className={styles.subtitle}>Join CollabCode and start coding together</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="name@example.com"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter secure password"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Repeat your password"
            />
          </div>

          <Button type="submit" disabled={isLoading} className={styles.submitBtn}>
            {isLoading ? "Creating Account..." : "Sign Up"}
          </Button>
        </form>

        <div className={styles.footer}>
          Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); showToast("Sign In page coming soon", "info"); }}>Sign In</a>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
