import Link from 'next/link'
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, Award } from 'lucide-react'

const footerLinks = {
  produtos: [
    { href: '/products?category=vitaminas', label: 'Vitaminas' },
    { href: '/products?category=proteina', label: 'Proteínas' },
    { href: '/products?category=omega3', label: 'Omega-3' },
    { href: '/products?category=pre-treino', label: 'Pre-Entrenamiento' },
    { href: '/products?category=sono', label: 'Sueño & Relax' },
    { href: '/products?category=colageno', label: 'Colágeno & Belleza' },
  ],
  ajuda: [
    { href: '/faq', label: 'Preguntas Frecuentes' },
    { href: '/shipping', label: 'Envíos y Devoluciones' },
    { href: '/about', label: 'Sobre Nosotros' },
    { href: '/contact', label: 'Contacto' },
    { href: '/blog', label: 'Blog de Salud' },
  ],
  conta: [
    { href: '/auth/login', label: 'Iniciar Sesión' },
    { href: '/auth/register', label: 'Crear Cuenta' },
    { href: '/account/orders', label: 'Mis Pedidos' },
    { href: '/account', label: 'Programa de Puntos' },
    { href: '/quiz', label: 'Test de Salud' },
  ],
  legal: [
    { href: '/privacy', label: 'Política de Privacidad' },
    { href: '/terms', label: 'Términos y Condiciones' },
    { href: '/cookies', label: 'Política de Cookies' },
    { href: '/gdpr', label: 'RGPD' },
  ],
}

const socialLinks = [
  { href: '#', label: 'Facebook', Icon: Facebook },
  { href: '#', label: 'Instagram', Icon: Instagram },
  { href: '#', label: 'Twitter', Icon: Twitter },
  { href: '#', label: 'YouTube', Icon: Youtube },
]

const certifications = [
  'ISO 9001:2015',
  'GMP Certified',
  'EFSA Compliant',
  'AESAN Registrado',
]

export function Footer() {
  return (
    <footer
      className="bg-gray-900 text-gray-300"
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">
        Pie de página
      </h2>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="flex items-center gap-2 mb-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-lg w-fit"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600">
                <span className="text-white font-bold text-lg">V</span>
              </div>
              <span className="font-bold text-xl text-white">
                Vita<span className="text-primary-400">Shop</span>
              </span>
            </Link>

            <p className="text-sm leading-relaxed mb-6 text-gray-400 max-w-xs">
              Tu tienda de confianza para suplementos y productos de salud de calidad.
              Apoyamos tu bienestar con productos testados y certificados por AESAN.
            </p>

            {/* Contact */}
            <div className="space-y-3 mb-6">
              <a
                href="tel:+34910000000"
                className="flex items-center gap-2.5 text-sm hover:text-primary-400 transition-colors group"
              >
                <Phone className="h-4 w-4 text-primary-500 shrink-0" aria-hidden="true" />
                +34 91 000 0000
              </a>
              <a
                href="mailto:soporte@vitashop.es"
                className="flex items-center gap-2.5 text-sm hover:text-primary-400 transition-colors"
              >
                <Mail className="h-4 w-4 text-primary-500 shrink-0" aria-hidden="true" />
                soporte@vitashop.es
              </a>
              <address className="flex items-start gap-2.5 text-sm not-italic">
                <MapPin className="h-4 w-4 text-primary-500 shrink-0 mt-0.5" aria-hidden="true" />
                <span className="text-gray-400">
                  Calle de la Salud, 123<br />
                  28001 Madrid, España
                </span>
              </address>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${label} - abre en una nueva ventana`}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-800 text-gray-400 hover:bg-primary-600 hover:text-white transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Productos
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.produtos.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-gray-400 hover:text-primary-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Ayuda
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.ajuda.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-gray-400 hover:text-primary-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Mi Cuenta
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.conta.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-gray-400 hover:text-primary-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Certifications */}
        <div className="py-6 border-t border-gray-800">
          <div className="flex flex-wrap items-center justify-center gap-4">
            {certifications.map((cert) => (
              <span
                key={cert}
                className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-800 px-3 py-1.5 rounded-full"
              >
                <Award className="h-3.5 w-3.5 text-primary-500" aria-hidden="true" />
                {cert}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500 text-center sm:text-left">
            &copy; {new Date().getFullYear()} VitaShop. Todos los derechos reservados.
            <span className="mx-2">|</span>
            <span>NIF: ESA12345678</span>
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {footerLinks.legal.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-xs text-gray-500 hover:text-gray-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Payment methods */}
          <div className="flex items-center gap-2" aria-label="Métodos de pago aceptados">
            {['Visa', 'MC', 'Bizum', 'PayPal', '3DS'].map((method) => (
              <span
                key={method}
                className="flex h-7 min-w-[40px] items-center justify-center rounded bg-gray-800 px-2 text-[10px] font-bold text-gray-400"
                aria-label={method}
              >
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
