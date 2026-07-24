"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { registerUser } from "@/lib/services/authService";
import { saveToken } from "@/lib/utils/cookies";

import styles from "./register.module.css";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateForm({
  lastName,
  firstName,
  email,
  password,
  termsAccepted,
}) {
  const errors = {
    lastName: "",
    firstName: "",
    email: "",
    password: "",
    terms: "",
  };

  if (!lastName) {
    errors.lastName = "Veuillez saisir votre nom.";
  }

  if (!firstName) {
    errors.firstName = "Veuillez saisir votre prénom.";
  }

  if (!email) {
    errors.email = "Veuillez saisir votre adresse email.";
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = "Veuillez saisir une adresse email valide.";
  }

  if (!password) {
    errors.password = "Veuillez saisir un mot de passe.";
  }

  if (!termsAccepted) {
    errors.terms =
      "Vous devez accepter les conditions générales d’utilisation.";
  }

  return errors;
}

export default function RegisterForm() {
  const router = useRouter();

  const lastNameInputRef = useRef(null);
  const firstNameInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const termsInputRef = useRef(null);

  const [formData, setFormData] = useState({
    lastName: "",
    firstName: "",
    email: "",
    password: "",
    termsAccepted: false,
  });

  const [fieldErrors, setFieldErrors] = useState({
    lastName: "",
    firstName: "",
    email: "",
    password: "",
    terms: "",
  });

  const [formError, setFormError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(event) {
    const { name, value, checked, type } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: type === "checkbox" ? checked : value,
    }));

    const errorName =
      name === "termsAccepted" ? "terms" : name;

    setFieldErrors((currentErrors) => ({
      ...currentErrors,
      [errorName]: "",
    }));

    setFormError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (isLoading) return;

    const normalizedData = {
      lastName: formData.lastName.trim(),
      firstName: formData.firstName.trim(),
      email: formData.email.trim(),
      password: formData.password,
      termsAccepted: formData.termsAccepted,
    };

    const validationErrors = validateForm(normalizedData);

    setFieldErrors(validationErrors);
    setFormError("");

    const fieldOrder = [
      "lastName",
      "firstName",
      "email",
      "password",
      "terms",
    ];

    const firstInvalidField = fieldOrder.find(
      (fieldName) => validationErrors[fieldName]
    );

    if (firstInvalidField) {
      const fieldRefs = {
        lastName: lastNameInputRef,
        firstName: firstNameInputRef,
        email: emailInputRef,
        password: passwordInputRef,
        terms: termsInputRef,
      };

      requestAnimationFrame(() => {
        fieldRefs[firstInvalidField]?.current?.focus();
      });

      return;
    }

    setIsLoading(true);

    try {
      const data = await registerUser({
        name: `${normalizedData.firstName} ${normalizedData.lastName}`,
        email: normalizedData.email,
        password: normalizedData.password,
        role: "client",
      });

      saveToken(data.token);

      router.replace("/");
      router.refresh();
    } catch (error) {
      if (error.status === 409) {
        setFormError(
          "Un compte existe déjà avec cette adresse email."
        );
      } else if (error.status === 400) {
        setFormError(
          "Les informations saisies ne sont pas valides."
        );
      } else {
        setFormError(
          "Une erreur est survenue. Veuillez réessayer."
        );
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form
      className={styles.registerForm}
      onSubmit={handleSubmit}
      aria-describedby="register-description"
      aria-busy={isLoading}
      noValidate
    >
      {formError && (
        <p className={styles.formError} role="alert">
          {formError}
        </p>
      )}

      <div className={styles.formField}>
        <label
          className={styles.formLabel}
          htmlFor="lastName"
        >
          Nom
        </label>

        <input
          ref={lastNameInputRef}
          className={styles.formInput}
          id="lastName"
          name="lastName"
          type="text"
          autoComplete="family-name"
          value={formData.lastName}
          aria-invalid={Boolean(fieldErrors.lastName)}
          aria-describedby={
            fieldErrors.lastName
              ? "register-last-name-error"
              : undefined
          }
          onChange={handleChange}
        />

        {fieldErrors.lastName && (
          <p
            id="register-last-name-error"
            className={styles.fieldError}
          >
            {fieldErrors.lastName}
          </p>
        )}
      </div>

      <div className={styles.formField}>
        <label
          className={styles.formLabel}
          htmlFor="firstName"
        >
          Prénom
        </label>

        <input
          ref={firstNameInputRef}
          className={styles.formInput}
          id="firstName"
          name="firstName"
          type="text"
          autoComplete="given-name"
          value={formData.firstName}
          aria-invalid={Boolean(fieldErrors.firstName)}
          aria-describedby={
            fieldErrors.firstName
              ? "register-first-name-error"
              : undefined
          }
          onChange={handleChange}
        />

        {fieldErrors.firstName && (
          <p
            id="register-first-name-error"
            className={styles.fieldError}
          >
            {fieldErrors.firstName}
          </p>
        )}
      </div>

      <div className={styles.formField}>
        <label
          className={styles.formLabel}
          htmlFor="register-email"
        >
          Adresse email
        </label>

        <input
          ref={emailInputRef}
          className={styles.formInput}
          id="register-email"
          name="email"
          type="email"
          autoComplete="email"
          autoCapitalize="none"
          spellCheck="false"
          value={formData.email}
          aria-invalid={Boolean(fieldErrors.email)}
          aria-describedby={
            fieldErrors.email
              ? "register-email-error"
              : undefined
          }
          onChange={handleChange}
        />

        {fieldErrors.email && (
          <p
            id="register-email-error"
            className={styles.fieldError}
          >
            {fieldErrors.email}
          </p>
        )}
      </div>

      <div className={styles.formField}>
        <label
          className={styles.formLabel}
          htmlFor="register-password"
        >
          Mot de passe
        </label>

        <input
          ref={passwordInputRef}
          className={styles.formInput}
          id="register-password"
          name="password"
          type="password"
          autoComplete="new-password"
          value={formData.password}
          aria-invalid={Boolean(fieldErrors.password)}
          aria-describedby={
            fieldErrors.password
              ? "register-password-error"
              : undefined
          }
          onChange={handleChange}
        />

        {fieldErrors.password && (
          <p
            id="register-password-error"
            className={styles.fieldError}
          >
            {fieldErrors.password}
          </p>
        )}
      </div>

      <div>
        <div className={styles.termsField}>
          <input
            ref={termsInputRef}
            className={styles.checkbox}
            id="termsAccepted"
            name="termsAccepted"
            type="checkbox"
            checked={formData.termsAccepted}
            aria-invalid={Boolean(fieldErrors.terms)}
            aria-describedby={
              fieldErrors.terms
                ? "register-terms-error"
                : undefined
            }
            onChange={handleChange}
          />

          <label htmlFor="termsAccepted">
            J’accepte les{" "}
            <span className={styles.termsText}>
              conditions générales d’utilisation
            </span>
          </label>
        </div>

        {fieldErrors.terms && (
          <p
            id="register-terms-error"
            className={styles.fieldError}
          >
            {fieldErrors.terms}
          </p>
        )}
      </div>

      <button
        className={styles.submitButton}
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? "Inscription en cours…" : "S’inscrire"}
      </button>
    </form>
  );
}