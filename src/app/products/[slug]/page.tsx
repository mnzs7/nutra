import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { getProductBySlug, getRelatedProducts, products } from '@/lib/data/products'
import { ProductDetailClient } from './ProductDetailClient'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = getProductBySlug(params.slug)
  if (!product) return {}

  return {
    title: `${product.name} | VitaShop`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: product.images[0], alt: product.name }],
    },
  }
}

export default function ProductDetailPage({ params }: Props) {
  const product = getProductBySlug(params.slug)

  if (!product) {
    notFound()
  }

  const related = getRelatedProducts(product, 4)

  return (
    <Suspense fallback={<div className="container mx-auto max-w-7xl px-4 py-8 h-96 animate-pulse" />}>
      <ProductDetailClient product={product} relatedProducts={related} />
    </Suspense>
  )
}
