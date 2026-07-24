import Link from "next/link";
import LoginForm from "./LoginForm";
import styles from "./login.module.css";

export const metadata = {
  title: "Connexion | Kasa",
};

export default function LoginPage() {
  return (
    <div className={styles.loginPage}>
      <section
        className={styles.loginCard}
        aria-labelledby="login-title"
      >
        <h1 id="login-title" className={styles.loginTitle}>
          Heureux de vous revoir
        </h1>

        <p id="login-description" className={styles.loginDescription}>
          Connectez-vous pour retrouver vos réservations, vos annonces et tout
          ce qui rend vos séjours uniques.
        </p>

        <LoginForm />

        <p className={styles.forgotPassword}>Mot de passe oublié</p>

        <Link href="/register" className={styles.registerLink}>
          Pas encore de compte ? <strong>Inscrivez-vous</strong>
        </Link>
      </section>
    </div>
  );
}