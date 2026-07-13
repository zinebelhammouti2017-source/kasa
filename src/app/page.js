import { Suspense } from "react";

import Hero from "@/components/Hero/Hero";
import PropertyList from "@/components/PropertyList/PropertyList";
import PropertyGridSkeleton from "@/components/PropertyGridSkeleton/PropertyGridSkeleton";

export default function HomePage() {
  return (
    <>
      <Hero />

      <Suspense fallback={<PropertyGridSkeleton />}>
        <PropertyList />
      </Suspense>
    </>
  );
}