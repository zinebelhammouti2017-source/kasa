import AddPropertyForm from "./AddPropertyForm";

import styles from "./page.module.css";

export const metadata = {
  title: "Ajouter une propriété | Kasa",
};

export default function AddPropertyPage() {
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