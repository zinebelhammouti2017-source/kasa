import { getProperties } from "@/lib/services/propertiesService";

export default async function HomePage() {
  const properties = await getProperties();

  console.log(properties);

  return (
    <main>
      <h1>Liste des propriétés</h1>

      <p>Nombre de propriétés : {properties.length}</p>

      <ul>
        {properties.map((property) => (
          <li key={property.id}>
            {property.title}
          </li>
        ))}
      </ul>
    </main>
  );
}