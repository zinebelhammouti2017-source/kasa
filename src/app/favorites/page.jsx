import FavoritesList from "@/components/FavoritesList/FavoritesList";
import { getProperties } from "@/lib/services/propertiesService";

import styles from "./page.module.css";

export const metadata = {
  title: "Vos favoris | Kasa",
};

export default async function FavoritesPage() {
  const properties = await getProperties();

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1>Vos favoris</h1>

        <p>
          Retrouvez ici tous les logements que vous avez enregistrés.
        </p>
      </header>

      <FavoritesList properties={properties} />
    </main>
  );
}