"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { login } from "@/lib/services/authService";
import { saveToken } from "@/lib/utils/cookies";

import styles from "./login.module.css";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateCredentials(email, password) {
  const errors = {
    email: "",
    password: "",
  };

  if (!email) {
    errors.email = "Veuillez saisir votre adresse email.";
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = "Veuillez saisir une adresse email valide.";
  }

  if (!password) {
    errors.password = "Veuillez saisir votre mot de passe.";
  }

  return errors;
}

export default function LoginForm() {
  const router = useRouter();

  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    password: "",
  });

  const [formError, setFormError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function handleEmailChange(event) {
    setEmail(event.target.value);

    setFieldErrors((currentErrors) => ({
      ...currentErrors,
      email: "",
    }));

    setFormError("");
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);

    setFieldErrors((currentErrors) => ({
      ...currentErrors,
      password: "",
    }));

    setFormError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (isLoading) return;

    const normalizedEmail = email.trim();
    const validationErrors = validateCredentials(
      normalizedEmail,
      password
    );

    setFieldErrors(validationErrors);
    setFormError("");

    if (validationErrors.email || validationErrors.password) {
      requestAnimationFrame(() => {
        if (validationErrors.email) {
          emailInputRef.current?.focus();
        } else {
          passwordInputRef.current?.focus();
        }
      });

      return;
    }

    setIsLoading(true);

    try {
      const data = await login({
        email: normalizedEmail,
        password,
      });

      saveToken(data.token);

      router.replace("/");
      router.refresh();
    } catch (error) {
      if (error.status === 401) {
        setFormError("Adresse email ou mot de passe incorrect.");
      } else {
        setFormError("Une erreur est survenue. Veuillez réessayer.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form
      className={styles.loginForm}
      onSubmit={handleSubmit}
      aria-describedby="login-description"
      aria-busy={isLoading}
      noValidate
    >
      {formError && (
        <p className={styles.formError} role="alert">
          {formError}
        </p>
      )}

      <div className={styles.formField}>
        <label className={styles.formLabel} htmlFor="email">
          Adresse email
        </label>

        <input
          ref={emailInputRef}
          className={styles.formInput}
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          autoCapitalize="none"
          spellCheck="false"
          value={email}
          aria-invalid={Boolean(fieldErrors.email)}
          aria-describedby={
            fieldErrors.email ? "email-error" : undefined
          }
          onChange={handleEmailChange}
        />

        {fieldErrors.email && (
          <p
            id="email-error"
            className={styles.fieldError}
          >
            {fieldErrors.email}
          </p>
        )}
      </div>

      <div className={styles.formField}>
        <label className={styles.formLabel} htmlFor="password">
          Mot de passe
        </label>

        <input
          ref={passwordInputRef}
          className={styles.formInput}
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          aria-invalid={Boolean(fieldErrors.password)}
          aria-describedby={
            fieldErrors.password ? "password-error" : undefined
          }
          onChange={handlePasswordChange}
        />

        {fieldErrors.password && (
          <p
            id="password-error"
            className={styles.fieldError}
          >
            {fieldErrors.password}
          </p>
        )}
      </div>

      <button
        className={styles.submitButton}
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? "Connexion en cours…" : "Se connecter"}
      </button>
    </form>
  );
}