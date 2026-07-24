import Link from "next/link";

import RegisterForm from "./RegisterForm";

import styles from "./register.module.css";

export const metadata = {
  title: "Inscription | Kasa",
};

export default function RegisterPage() {
  return (
    <section
      className={styles.registerPage}
      aria-labelledby="register-title"
    >
      <div className={styles.registerCard}>
        <div className={styles.registerIntro}>
          <h1
            id="register-title"
            className={styles.registerTitle}
          >
            Rejoignez la communauté Kasa
          </h1>

          <p
            id="register-description"
            className={styles.registerDescription}
          >
            <span className={styles.descriptionLine}>
              Créez votre compte et commencez à voyager autrement :
              réservez des
            </span>

            <span className={styles.descriptionLine}>
              logements uniques, découvrez de nouvelles destinations et
              partagez vos
            </span>

            <span className={styles.descriptionLine}>
              propres lieux avec d’autres voyageurs.
            </span>
          </p>
        </div>

        <RegisterForm />

        <p className={styles.loginLink}>
          Déjà membre ? <Link href="/login">Se connecter</Link>
        </p>
      </div>
    </section>
  );
}