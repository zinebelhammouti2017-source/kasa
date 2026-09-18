"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  deleteProperty,
  getProperties,
} from "@/lib/services/propertiesService";

import {
  getCurrentUser,
  getToken,
} from "@/lib/utils/cookies";

import styles from "./page.module.css";

export default function MyPropertiesPage() {
  const router = useRouter();

  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [propertyToDelete, setPropertyToDelete] =
    useState(null);

  useEffect(() => {
    async function loadProperties() {
      const token = getToken();
      const currentUser = getCurrentUser();

      if (!token || !currentUser) {
        router.replace("/login");
        return;
      }

      if (currentUser.role !== "owner") {
        router.replace("/");
        return;
      }

      try {
        const allProperties = await getProperties();

        const ownerProperties = allProperties.filter(
          (property) =>
            String(property.host?.id) ===
            String(currentUser.id)
        );

        setProperties(ownerProperties);
      } catch (error) {
        console.error(
          "Impossible de charger les logements.",
          error
        );

        setErrorMessage(
          "Impossible de charger vos logements pour le moment."
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadProperties();
  }, [router]);

  function handleAskDelete(property) {
    setPropertyToDelete(property);
    setErrorMessage("");
  }

  function handleCancelDelete() {
    setPropertyToDelete(null);
  }

  async function handleConfirmDelete() {
    if (!propertyToDelete) return;

    try {
      setDeletingId(propertyToDelete.id);
      setErrorMessage("");

      await deleteProperty(propertyToDelete.id);

      setProperties((currentProperties) =>
        currentProperties.filter(
          (currentProperty) =>
            String(currentProperty.id) !==
            String(propertyToDelete.id)
        )
      );

      setPropertyToDelete(null);
    } catch (error) {
      console.error(
        "Impossible de supprimer le logement.",
        error
      );

      setErrorMessage(
        "Impossible de supprimer ce logement."
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <>
      <main className={styles.page}>
        <header className={styles.header}>
          <h1>Mes logements</h1>

          <p>
            Gérez les logements que vous avez publiés.
          </p>
        </header>

        {isLoading && (
          <p className={styles.message}>
            Chargement de vos logements…
          </p>
        )}

        {errorMessage && (
          <p
            className={styles.errorMessage}
            role="alert"
          >
            {errorMessage}
          </p>
        )}

        {!isLoading &&
          !errorMessage &&
          properties.length === 0 && (
            <div className={styles.emptyState}>
              <p>
                Vous n’avez encore ajouté aucun logement.
              </p>

              <Link
                href="/property/new"
                className={styles.addLink}
              >
                Ajouter un logement
              </Link>
            </div>
          )}

        {!isLoading && properties.length > 0 && (
          <ul className={styles.list}>
            {properties.map((property) => (
              <li
                key={property.id}
                className={styles.item}
              >
                <div className={styles.info}>
                  <h2>{property.title}</h2>

                  {property.location && (
                    <p>{property.location}</p>
                  )}
                </div>

                <div className={styles.actions}>
                  <Link
                    href={`/property/${property.id}`}
                    className={styles.viewLink}
                  >
                    Voir le logement
                  </Link>

                  <button
                    type="button"
                    className={styles.deleteButton}
                    onClick={() =>
                      handleAskDelete(property)
                    }
                    disabled={
                      deletingId === property.id
                    }
                  >
                    {deletingId === property.id
                      ? "Suppression…"
                      : "Supprimer"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>

      {propertyToDelete && (
        <div
          className={styles.modalOverlay}
          role="presentation"
        >
          <div
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
            aria-describedby="delete-modal-description"
          >
            <h2
              id="delete-modal-title"
              className={styles.modalTitle}
            >
              Supprimer ce logement ?
            </h2>

            <p
              id="delete-modal-description"
              className={styles.modalText}
            >
              Vous êtes sur le point de supprimer{" "}
              <strong>
                « {propertyToDelete.title} »
              </strong>
              . Cette action est définitive.
            </p>

            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={handleCancelDelete}
                disabled={Boolean(deletingId)}
              >
                Annuler
              </button>

              <button
                type="button"
                className={styles.confirmButton}
                onClick={handleConfirmDelete}
                disabled={Boolean(deletingId)}
              >
                {deletingId
                  ? "Suppression…"
                  : "Oui, supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}