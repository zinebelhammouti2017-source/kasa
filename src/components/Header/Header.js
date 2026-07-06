import Link from "next/link";
import Logo from "../Logo/Logo";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <nav className={styles.leftNav} aria-label="Navigation principale">
        <Link href="/">Accueil</Link>
        <Link href="/about">À propos</Link>
      </nav>

      <Link href="/" aria-label="Retour à l'accueil Kasa">
        <Logo />
      </Link>

      <div className={styles.actions}>
        <Link href="/properties/new" className={styles.addLink}>
          + Ajouter un logement
        </Link>
        <Link href="/favorites" aria-label="Favoris">
          ♡
        </Link>
        <Link href="/messages" aria-label="Messagerie">
          ▢
        </Link>
      </div>

      <button
        className={styles.menuButton}
        type="button"
        aria-label="Ouvrir le menu"
      >
        ☰
      </button>
    </header>
  );
}