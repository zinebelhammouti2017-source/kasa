import PropertyGrid from "@/components/PropertyGrid/PropertyGrid";
import { getProperties } from "@/lib/services/propertiesService";

export default async function PropertyList() {

  const properties = await getProperties();

  return <PropertyGrid properties={properties} />;
}