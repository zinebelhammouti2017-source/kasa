import Link from "next/link";
import { notFound } from "next/navigation";

import {
  getPropertyById,
  PropertyApiError,
} from "@/lib/services/propertiesService";
import PropertyCarousel from "@/components/PropertyCarousel/PropertyCarousel.jsx";
import PropertyInfo from "@/components/PropertyInfo/PropertyInfo";
import HostCard from "@/components/HostCard/HostCard";

import styles from "./page.module.css";

export default async function PropertyDetailPage({ params }) {
  const { id } = await params;
  let property;

  try {
    property = await getPropertyById(id);
  } catch (error) {
    if (error instanceof PropertyApiError && error.type === "not_found") {
      notFound();
    }

    throw error;
  }

  return (
    <div className={styles.page}>
      <Link href="/" className={styles.backLink}>
        ← Retour aux annonces
      </Link>

      <div className={styles.layout}>
        <div className={styles.leftColumn}>
          <PropertyCarousel
            pictures={property.pictures}
            title={property.title}
          />

          <PropertyInfo
            title={property.title}
            location={property.location}
            pricePerNight={property.price_per_night}
            description={property.description}
            equipments={property.equipments}
            tags={property.tags}
          />
        </div>

        <div className={styles.rightColumn}>
          <HostCard
            host={property.host}
            rating={property.rating_avg}
          />
        </div>
      </div>
    </div>
  );
}
