import type { Metadata } from 'next'
import { Hero } from '@/components/home/Hero'
import { TrustBadges } from '@/components/home/TrustBadges'
import { Categories } from '@/components/home/Categories'
import { FeaturedProducts } from '@/components/home/FeaturedProducts'
import { Testimonials } from '@/components/home/Testimonials'
import { Newsletter } from '@/components/home/Newsletter'

export const metadata: Metadata = {
  title: 'VitaShop - Suplementos Premium de Salud y Bienestar',
  description:
    'Compra suplementos y vitaminas de alta calidad en VitaShop. Entrega en 24-48h, devolución gratuita en 30 días y programa de fidelidad.',
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBadges />
      <Categories />
      <FeaturedProducts />
      <Testimonials />
      <Newsletter />
    </>
  )
}
