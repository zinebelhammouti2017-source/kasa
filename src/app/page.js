import Hero from "@/components/Hero/Hero";
import PropertyGrid from "@/components/PropertyGrid/PropertyGrid";
import { getProperties } from "@/lib/services/propertiesService";

export default async function HomePage() {
  const properties = await getProperties();

  return (
    <>
      <Hero />
      <PropertyGrid properties={properties} />
    </>
  );
}