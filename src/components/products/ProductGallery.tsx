'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, ZoomIn, X } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface ProductGalleryProps {
  images: string[]
  productName: string
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const prevImage = () => {
    setSelectedIndex((i) => (i === 0 ? images.length - 1 : i - 1))
    setImageLoaded(false)
  }

  const nextImage = () => {
    setSelectedIndex((i) => (i === images.length - 1 ? 0 : i + 1))
    setImageLoaded(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') prevImage()
    if (e.key === 'ArrowRight') nextImage()
    if (e.key === 'Escape') setLightboxOpen(false)
  }

  return (
    <>
      <div className="space-y-3">
        {/* Main Image */}
        <div
          className="relative aspect-square overflow-hidden rounded-2xl bg-gray-50 dark:bg-gray-800 cursor-zoom-in"
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="img"
          aria-label={`${productName} - Imagen ${selectedIndex + 1} de ${images.length}`}
          onClick={() => setLightboxOpen(true)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative h-full w-full"
            >
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-2xl" />
              )}
              <Image
                src={images[selectedIndex]}
                alt={`${productName} - foto ${selectedIndex + 1}`}

                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className={cn(
                  'object-cover transition-opacity duration-300',
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                )}
                priority={selectedIndex === 0}
                onLoad={() => setImageLoaded(true)}
              />
            </motion.div>
          </AnimatePresence>

          {/* Zoom indicator */}
          <div className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 dark:bg-gray-800/90 shadow-sm">
            <ZoomIn className="h-4 w-4 text-gray-600 dark:text-gray-300" aria-hidden="true" />
          </div>

          {/* Navigation arrows (only if multiple images) */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prevImage() }}
                className={cn(
                  'absolute left-2 top-1/2 -translate-y-1/2',
                  'flex h-8 w-8 items-center justify-center rounded-full',
                  'bg-white/90 dark:bg-gray-800/90 shadow-sm',
                  'hover:bg-white dark:hover:bg-gray-800',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                  'transition-all'
                )}
                aria-label="Imagen anterior"
              >
                <ChevronLeft className="h-4 w-4 text-gray-700 dark:text-gray-200" aria-hidden="true" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextImage() }}
                className={cn(
                  'absolute right-2 top-1/2 -translate-y-1/2',
                  'flex h-8 w-8 items-center justify-center rounded-full',
                  'bg-white/90 dark:bg-gray-800/90 shadow-sm',
                  'hover:bg-white dark:hover:bg-gray-800',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                  'transition-all'
                )}
                aria-label="Siguiente imagen"
              >
                <ChevronRight className="h-4 w-4 text-gray-700 dark:text-gray-200" aria-hidden="true" />
              </button>
            </>
          )}

          {/* Image counter */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5" role="tablist" aria-label="Seleccionar imagen">
              {images.map((_, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={i === selectedIndex}
                  aria-label={`Imagen ${i + 1}`}
                  onClick={(e) => { e.stopPropagation(); setSelectedIndex(i); setImageLoaded(false) }}
                  className={cn(
                    'h-1.5 rounded-full transition-all',
                    i === selectedIndex
                      ? 'w-4 bg-primary-600'
                      : 'w-1.5 bg-white/60 hover:bg-white/80'
                  )}
                />
              ))}
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Miniaturas">
            {images.map((src, index) => (
              <button
                key={index}
                role="tab"
                aria-selected={index === selectedIndex}
                aria-label={`Ver imagen ${index + 1}`}
                onClick={() => { setSelectedIndex(index); setImageLoaded(false) }}
                className={cn(
                  'relative shrink-0 h-20 w-20 overflow-hidden rounded-lg border-2',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                  'transition-all',
                  index === selectedIndex
                    ? 'border-primary-600 ring-2 ring-primary-200'
                    : 'border-transparent hover:border-gray-300'
                )}
              >
                <Image
                  src={src}
                  alt={`${productName} miniatura ${index + 1}`}

                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={() => setLightboxOpen(false)}
            onKeyDown={handleKeyDown}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={`Ampliar ${productName}`}
          >
            <button
              className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white transition-all"
              onClick={() => setLightboxOpen(false)}
              aria-label="Cerrar imagen"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>

            {images.length > 1 && (
              <>
                <button
                  className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white transition-all"
                  onClick={(e) => { e.stopPropagation(); prevImage() }}
                  aria-label="Imagen anterior"
                >
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white transition-all"
                  onClick={(e) => { e.stopPropagation(); nextImage() }}
                  aria-label="Siguiente imagen"
                >
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </>
            )}

            <motion.div
              key={selectedIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="relative max-h-[85vh] max-w-[85vw] aspect-square"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[selectedIndex]}
                alt={`${productName} - vista ampliada ${selectedIndex + 1}`}
                fill
                sizes="85vw"
                className="object-contain"
              />
            </motion.div>

            <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/70">
              {selectedIndex + 1} / {images.length}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
