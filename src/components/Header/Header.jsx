"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import Logo from "../Logo/Logo";
import HouseLogo from "../HouseLogo/HouseLogo";

import styles from "./Header.module.css";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuButtonRef = useRef(null);
  const closeButtonRef = useRef(null);

  function openMenu() {
    setIsMenuOpen(true);
  }

  function closeMenu() {
    setIsMenuOpen(false);
  }

  useEffect(() => {
    if (!isMenuOpen) return;

    closeButtonRef.current?.focus();

    function handleEscape(event) {
      if (event.key === "Escape") {
        closeMenu();
        menuButtonRef.current?.focus();
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isMenuOpen]);

  return (
    <header className={styles.header}>
      <nav className={styles.leftNav} aria-label="Navigation principale">
        <Link href="/">Accueil</Link>
        <Link href="/about">À propos</Link>
      </nav>

      <Link
        href="/"
        className={styles.logoLink}
        aria-label="Retour à l’accueil Kasa"
      >
        <Logo />
      </Link>

      <div className={styles.actions}>
        <Link href="/properties/new" className={styles.addLink}>
          + Ajouter un logement
        </Link>

        <Link href="/favorites" aria-label="Consulter les favoris">
          ♡
        </Link>

        <Link href="/messages" aria-label="Consulter les messages">
          ▢
        </Link>
      </div>

      <button
        ref={menuButtonRef}
        type="button"
        className={styles.menuButton}
        aria-label="Ouvrir le menu"
        aria-expanded={isMenuOpen}
        aria-controls="mobile-navigation"
        onClick={openMenu}
      >
        ☰
      </button>

      {isMenuOpen && (
        <div className={styles.mobileMenuContainer}>
          <button
            type="button"
            className={styles.overlay}
            aria-label="Fermer le menu"
            onClick={closeMenu}
          />

          <nav
            id="mobile-navigation"
            className={styles.mobileMenu}
            aria-label="Navigation mobile"
          >
            <div className={styles.mobileMenuHeader}>
              <Link
                href="/"
                aria-label="Retour à l’accueil Kasa"
                onClick={closeMenu}
              >
                <HouseLogo />
              </Link>

              <button
                ref={closeButtonRef}
                type="button"
                className={styles.closeButton}
                aria-label="Fermer le menu"
                onClick={() => {
                  closeMenu();
                  menuButtonRef.current?.focus();
                }}
              >
                ×
              </button>
            </div>

            <div className={styles.mobileLinks}>
              <Link href="/" onClick={closeMenu}>
                Accueil
              </Link>

              <Link href="/about" onClick={closeMenu}>
                À propos
              </Link>

              <Link href="/messages" onClick={closeMenu}>
                Messagerie
              </Link>

              <Link href="/favorites" onClick={closeMenu}>
                Favoris
              </Link>
            </div>

            <Link
              href="/properties/new"
              className={styles.mobileAddLink}
              onClick={closeMenu}
            >
              Ajouter un logement
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}