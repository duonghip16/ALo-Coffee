import { MainLayout } from "@/components/layout/main-layout"
import { HeroSection } from "@/components/home/hero-section"
import { FeaturedProducts } from "@/components/home/featured-products"

export default function Home() {
  return (
    <MainLayout>
      <HeroSection />
      <FeaturedProducts />
    </MainLayout>
  )
}
