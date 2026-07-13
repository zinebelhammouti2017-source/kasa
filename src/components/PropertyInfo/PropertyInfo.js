import styles from "./PropertyInfo.module.css";

export default function PropertyInfo({
  title,
  location,
  pricePerNight,
  description,
  equipments,
  tags,
}) {
  return (
    <section className={styles.info} aria-labelledby="property-title">
      <h1 id="property-title" className={styles.title}>
        {title}
      </h1>

      <p className={styles.location}>{location}</p>

      <p className={styles.price}>
        {pricePerNight}€ <span>par nuit</span>
      </p>

      <p className={styles.description}>{description}</p>

      <div className={styles.group}>
        <h2 className={styles.subtitle}>Équipements</h2>

        <ul className={styles.tags}>
          {equipments.map((equipment) => (
            <li key={equipment}>{equipment}</li>
          ))}
        </ul>
      </div>

      <div className={styles.group}>
        <h2 className={styles.subtitle}>Catégorie</h2>

        <ul className={styles.tags}>
          {tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}