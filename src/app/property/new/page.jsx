import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import AddPropertyForm from "./AddPropertyForm";

import styles from "./page.module.css";

export const metadata = {
  title: "Ajouter une propriété | Kasa",
};

function getUserFromToken(token) {
  if (!token) return null;

  try {
    const payload = token.split(".")[1];

    if (!payload) return null;

    const decodedPayload = Buffer.from(
      payload,
      "base64url"
    ).toString("utf8");

    return JSON.parse(decodedPayload);
  } catch {
    return null;
  }
}

export default async function AddPropertyPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  const currentUser = getUserFromToken(token);

  const canAddProperty =
    currentUser?.role === "owner" ||
    currentUser?.role === "admin";

  if (!canAddProperty) {
    redirect("/");
  }

  return (
    <section
      className={styles.page}
      aria-labelledby="add-property-title"
    >
      <header className={styles.pageHeader}>
        <h1
          id="add-property-title"
          className={styles.pageTitle}
        >
          Ajouter une propriété
        </h1>

        <button
          type="submit"
          form="add-property-form"
          className={styles.submitButton}
        >
          Ajouter
        </button>
      </header>

      <AddPropertyForm />
    </section>
  );
}