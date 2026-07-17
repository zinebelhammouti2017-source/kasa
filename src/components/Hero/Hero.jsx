import Image from "next/image";
import heroImage from "@/assets/images/hero.png";

import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <h1>Chez vous, partout et ailleurs</h1>
        <p>
          Avec Kasa, vivez des séjours uniques dans des hébergements chaleureux,
          sélectionnés avec soin par nos hôtes.
        </p>
      </div>

      <div className={styles.imageWrapper}>
        <Image
          src={heroImage}
          alt="Maison moderne entourée de nature"
          priority
        />
      </div>
    </section>
  );
}