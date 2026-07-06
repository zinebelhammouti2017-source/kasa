import PropertyCard from "../PropertyCard/PropertyCard";
import styles from "./PropertyGrid.module.css";

export default function PropertyGrid({ properties }) {
  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </section>
  );
}