import Image from "next/image";

import image1 from "@/assets/images/image1.png";
import image2 from "@/assets/images/image2.png";

import styles from "./page.module.css";

export const metadata = {
  title: "À propos | Kasa",
  description:
    "Découvrez Kasa, sa mission et son engagement pour des séjours authentiques.",
};

export default function AboutPage() {
  return (
    <div className={styles.aboutPage}>
      <section className={styles.introduction} aria-labelledby="about-title">
        <h1 id="about-title" className={styles.title}>
          À propos
        </h1>

        <div className={styles.introductionText}>
          <p>
            Chez Kasa, nous croyons que chaque voyage mérite un lieu unique où
            se sentir bien.
          </p>

          <p>
            Depuis notre création, nous mettons en relation des voyageurs en
            quête d’authenticité avec des hôtes passionnés qui aiment partager
            leur région et leurs bonnes adresses.
          </p>
        </div>
      </section>

      <div className={styles.mainImage}>
        <Image
          src={image1}
          alt="Maison en bois entourée d’arbres"
          priority
          sizes="(max-width: 768px) calc(100vw - 64px), 1050px"
        />
      </div>

      <section
        className={styles.missionSection}
        aria-labelledby="mission-title"
      >
        <div className={styles.missionContent}>
          <h2 id="mission-title" className={styles.missionTitle}>
            Notre mission est simple :
          </h2>

          <ol className={styles.missionList}>
            <li>Offrir une plateforme fiable et simple d’utilisation</li>
            <li>Proposer des hébergements variés et de qualité</li>
            <li>
              Favoriser des échanges humains et chaleureux entre hôtes et
              voyageurs
            </li>
          </ol>

          <p className={styles.conclusion}>
            Que vous cherchiez un appartement cosy en centre-ville, une maison
            en bord de mer ou un chalet à la montagne, Kasa vous accompagne pour
            que chaque séjour devienne un souvenir inoubliable.
          </p>
        </div>

        <div className={styles.secondaryImage}>
          <Image
            src={image2}
            alt="Maison de montagne avec une grande façade vitrée"
            sizes="(max-width: 768px) calc(100vw - 64px), 440px"
          />
        </div>
      </section>
    </div>
  );
}