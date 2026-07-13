import Image from "next/image";
import styles from "./PropertyGallery.module.css";

export default function PropertyGallery({ pictures, title }) {
  if (!pictures?.length) {
    return null;
  }

  const [mainPicture, ...secondaryPictures] = pictures;

  return (
    <section
      className={styles.gallery}
      aria-label={`Galerie photos de ${title}`}
    >
      <div className={styles.mainImage}>
        <Image
          src={mainPicture}
          alt={`${title} - photo principale`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 55vw"
          className={styles.image}
        />
      </div>

      {secondaryPictures.length > 0 && (
        <div className={styles.secondaryGrid}>
          {secondaryPictures.slice(0, 4).map((picture, index) => (
            <div className={styles.secondaryImage} key={picture}>
              <Image
                src={picture}
                alt={`${title} - photo ${index + 2}`}
                fill
                sizes="(max-width: 768px) 50vw, 20vw"
                className={styles.image}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}