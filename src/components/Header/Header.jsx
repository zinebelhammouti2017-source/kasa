"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Logo from "../Logo/Logo";
import HouseLogo from "../HouseLogo/HouseLogo";

import {
  AUTH_CHANGE_EVENT,
  getToken,
  removeToken,
} from "@/lib/utils/cookies";

import styles from "./Header.module.css";

function AccountIcon() {
  return (
    <svg
      className={styles.accountIcon}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="9" r="3" />
      <path d="M6.5 18c1.2-2.8 3-4.2 5.5-4.2s4.3 1.4 5.5 4.2" />
    </svg>
  );
}

export default function Header() {
  const router = useRouter();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] =
    useState(false);
  const [isAuthenticated, setIsAuthenticated] =
    useState(false);

  const menuButtonRef = useRef(null);
  const closeButtonRef = useRef(null);
  const accountButtonRef = useRef(null);
  const accountAreaRef = useRef(null);

  function updateAuthentication() {
    setIsAuthenticated(Boolean(getToken()));
  }

  function openMenu() {
    setIsAccountMenuOpen(false);
    setIsMenuOpen(true);
  }

  function closeMenu() {
    setIsMenuOpen(false);
  }

  function closeMenuAndRestoreFocus() {
    closeMenu();
    menuButtonRef.current?.focus();
  }

  function toggleAccountMenu() {
    setIsAccountMenuOpen((currentState) => !currentState);
  }

  function handleLogout() {
    removeToken();

    setIsAuthenticated(false);
    setIsAccountMenuOpen(false);
    setIsMenuOpen(false);

    router.replace("/");
    router.refresh();
  }

  useEffect(() => {
    updateAuthentication();

    window.addEventListener(
      AUTH_CHANGE_EVENT,
      updateAuthentication
    );

    window.addEventListener("focus", updateAuthentication);

    return () => {
      window.removeEventListener(
        AUTH_CHANGE_EVENT,
        updateAuthentication
      );

      window.removeEventListener(
        "focus",
        updateAuthentication
      );
    };
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;

    closeButtonRef.current?.focus();

    function handleEscape(event) {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isAccountMenuOpen) return;

    function handlePointerDown(event) {
      if (
        !accountAreaRef.current?.contains(event.target)
      ) {
        setIsAccountMenuOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setIsAccountMenuOpen(false);
        accountButtonRef.current?.focus();
      }
    }

    document.addEventListener(
      "pointerdown",
      handlePointerDown
    );

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener(
        "pointerdown",
        handlePointerDown
      );

      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [isAccountMenuOpen]);

  return (
    <header className={styles.header}>
      <nav
        className={styles.leftNav}
        aria-label="Navigation principale"
      >
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
        <Link
          href="/properties/new"
          className={styles.addLink}
        >
          + Ajouter un logement
        </Link>

        <Link
          href="/favorites"
          aria-label="Consulter les favoris"
        >
          ♡
        </Link>

        <Link
          href="/messages"
          aria-label="Consulter les messages"
        >
          ▢
        </Link>

        <div
          ref={accountAreaRef}
          className={styles.accountArea}
        >
          {isAuthenticated ? (
            <>
              <button
                ref={accountButtonRef}
                type="button"
                className={styles.accountButton}
                aria-label="Ouvrir le menu du compte"
                aria-expanded={isAccountMenuOpen}
                aria-controls="account-menu"
                onClick={toggleAccountMenu}
              >
                <AccountIcon />
              </button>

              {isAccountMenuOpen && (
                <div
                  id="account-menu"
                  className={styles.accountMenu}
                >
                  <button
                    type="button"
                    className={styles.logoutButton}
                    onClick={handleLogout}
                  >
                    Se déconnecter
                  </button>
                </div>
              )}
            </>
          ) : (
            <Link
              href="/login"
              className={styles.accountLink}
              aria-label="Se connecter"
            >
              <AccountIcon />
            </Link>
          )}
        </div>
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
            onClick={closeMenuAndRestoreFocus}
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
                onClick={closeMenuAndRestoreFocus}
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

              <Link
                href="/favorites"
                onClick={closeMenu}
              >
                Favoris
              </Link>

              <Link href="/messages" onClick={closeMenu}>
                Messagerie
              </Link>

              {isAuthenticated ? (
                <button
                  type="button"
                  className={styles.mobileLogoutButton}
                  onClick={handleLogout}
                >
                  Se déconnecter
                </button>
              ) : (
                <Link href="/login" onClick={closeMenu}>
                  Se connecter
                </Link>
              )}
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