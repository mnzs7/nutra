import type { Metadata } from 'next'
import { Hero } from '@/components/home/Hero'
import { TrustBadges } from '@/components/home/TrustBadges'
import { Categories } from '@/components/home/Categories'
import { FeaturedProducts } from '@/components/home/FeaturedProducts'
import { Testimonials } from '@/components/home/Testimonials'
import { Newsletter } from '@/components/home/Newsletter'

export const metadata: Metadata = {
  title: 'VitaShop - Suplementos Premium de Saúde e Bem-Estar',
  description:
    'Compre suplementos e vitaminas de alta qualidade na VitaShop. Entrega em 24-48h, devolução gratuita em 30 dias e programa de fidelidade.',
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
