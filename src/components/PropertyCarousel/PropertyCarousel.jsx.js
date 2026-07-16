"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./PropertyCarousel.module.css";

export default function PropertyCarousel({ pictures, title }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!pictures?.length) {
    return null;
  }

  const hasMultiplePictures = pictures.length > 1;

  function showPreviousPicture() {
    setCurrentIndex((previousIndex) =>
      previousIndex === 0 ? pictures.length - 1 : previousIndex - 1
    );
  }

  function showNextPicture() {
    setCurrentIndex((previousIndex) =>
      previousIndex === pictures.length - 1 ? 0 : previousIndex + 1
    );
  }

  return (
    <section
      className={styles.carousel}
      aria-label={`Photos du logement ${title}`}
    >
      <div className={styles.mainImage}>
        <Image
          src={pictures[currentIndex]}
          alt={`${title} - photo ${currentIndex + 1} sur ${pictures.length}`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 55vw"
          className={styles.image}
        />

        {hasMultiplePictures && (
          <>
            <button
              type="button"
              className={`${styles.navigationButton} ${styles.previousButton}`}
              onClick={showPreviousPicture}
              aria-label="Afficher la photo précédente"
            >
              ←
            </button>

            <button
              type="button"
              className={`${styles.navigationButton} ${styles.nextButton}`}
              onClick={showNextPicture}
              aria-label="Afficher la photo suivante"
            >
              →
            </button>

            <p className={styles.counter} aria-live="polite">
              {currentIndex + 1} / {pictures.length}
            </p>
          </>
        )}
      </div>

      {hasMultiplePictures && (
        <div
          className={styles.thumbnailGrid}
          aria-label="Sélectionner une photo"
        >
          {pictures.map((picture, index) => {
            const isCurrentPicture = index === currentIndex;

            return (
              <button
                type="button"
                className={styles.thumbnailButton}
                key={picture}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Afficher la photo ${index + 1}`}
                aria-current={isCurrentPicture ? "true" : undefined}
              >
                <Image
                  src={picture}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 25vw, 12vw"
                  className={styles.image}
                />
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}