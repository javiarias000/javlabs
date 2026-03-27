import { Helmet } from 'react-helmet-async';

/**
 * Componente SEO para gestión de meta tags y structured data
 *
 * Uso:
 * <SEO
 *   title="Mi Página"
 *   description="Descripción única para esta página"
 *   ogTitle="Título para redes sociales"
 *   ogDescription="Descripción para redes"
 *   ogImage="/ruta/imagen.jpg"
 *   canonicalUrl="/ruta-canonica"
 *   breadcrumbItems={[{name: 'Inicio', url: '/'}, {name: 'Página', url: '/pagina'}]}
 *   faqSchema={[{question: '¿Pregunta?', answer: 'Respuesta'}]}
 *   serviceName="Nombre del servicio"
 *   serviceDescription="Descripción del servicio"
 * />
 */
export default function SEO({
  // Meta tags básicos
  title = 'JAV LABS | Automatización con IA',
  description = 'JAV LABS - Agencia de automatización con IA en Ecuador. Automatizamos procesos, integramos sistemas y creamos agentes de IA para empresas.',
  ogTitle,
  ogDescription,
  ogImage = '/Logo2.png',
  ogUrl,
  canonicalUrl,
  twitterCard = 'summary_large_image',
  twitterSite = '@jav_labs',

  // Structured Data
  breadcrumbItems, // [{name: string, url: string}]
  faqSchema, // [{question: string, answer: string}]
  serviceName,
  serviceDescription,
  servicePrice,
  servicePriceCurrency = 'USD',

  // JSON-LD personalizado
  customJsonLd,
}) {
  // Usar ogTitle/ogDescription si existen, sino usar title/description
  const finalOgTitle = ogTitle || title;
  const finalOgDescription = ogDescription || description;

  // URL canónica - Usar variable de entorno o valor por defecto
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://jav-labs.com';
  const finalCanonicalUrl = canonicalUrl ? `${siteUrl}${canonicalUrl}` : undefined;

  // URL OG
  const finalOgUrl = ogUrl ? `${siteUrl}${ogUrl}` : undefined;

  // Construir JSON-LD
  const jsonLdData = {
    '@context': 'https://schema.org',
    ...(customJsonLd || {}),
  };

  // Agregar Organization schema siempre
  if (!jsonLdData['@graph']) {
    jsonLdData['@graph'] = [];
  }

  // Schema Organization
  const organizationSchema = {
    '@type': 'Organization',
    name: 'JAV LABS',
    description: description,
    url: siteUrl,
    logo: `${siteUrl}/Logo2.png`,
    image: `${siteUrl}/Logo2.png`,
    foundingDate: '2025-01-01',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '', // TODO: Agregar dirección física
      addressLocality: 'Ambato',
      addressRegion: 'Tungurahua',
      postalCode: '', // TODO: Agregar código postal
      addressCountry: 'EC',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+593967685172',
      contactType: 'customer service',
      email: 'jorge.arias.amauta@gmail.com',
      areaServed: {
        '@type': 'Country',
        name: 'Ecuador',
      },
      availableLanguage: ['es'],
    },
    sameAs: [
      // TODO: Agregar redes sociales cuando existan
      // 'https://facebook.com/javlabs',
      // 'https://linkedin.com/company/javlabs',
      // 'https://instagram.com/jav_labs',
      // 'https://twitter.com/jav_labs',
    ],
  };
  jsonLdData['@graph'].push(organizationSchema);

  // Schema BreadcrumbList
  if (breadcrumbItems && breadcrumbItems.length > 0) {
    const breadcrumbSchema = {
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbItems.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: `${siteUrl}${item.url}`,
      })),
    };
    jsonLdData['@graph'].push(breadcrumbSchema);
  }

  // Schema FAQPage
  if (faqSchema && faqSchema.length > 0) {
    const faqPageSchema = {
      '@type': 'FAQPage',
      mainEntity: faqSchema.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    };
    jsonLdData['@graph'].push(faqPageSchema);
  }

  // Schema Service (con posibilidad de múltiples servicios)
  if (serviceName) {
    const serviceSchema = {
      '@type': 'Service',
      name: serviceName,
      description: serviceDescription || description,
      provider: {
        '@type': 'Organization',
        name: 'JAV LABS',
      },
      countryOfOrigin: 'EC',
      areaServed: {
        '@type': 'Country',
        name: 'Ecuador',
      },
      serviceOutput: 'Automatización de procesos y sistemas de IA',
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Planes de Servicio',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Automatización de Procesos',
              description: 'Recupera 40+ horas mensuales eliminando tareas repetitivas',
            },
            price: 'Consulta',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'IA Generativa',
              description: 'Asistente de IA personalizado para atención y calificación',
            },
            price: 'Incluido en planes',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Integración de Sistemas',
              description: 'Conecta todas tus herramientas en un solo flujo',
            },
            price: 'Incluido en planes',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
          },
        ],
      },
      ...(servicePrice && {
        offers: {
          '@type': 'Offer',
          price: servicePrice,
          priceCurrency: servicePriceCurrency,
          availability: 'https://schema.org/InStock',
        },
      }),
    };
    jsonLdData['@graph'].push(serviceSchema);
  }

  return (
    <>
      <Helmet>
        {/* Basic Meta Tags */}
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={finalOgTitle} />
        <meta property="og:description" content={finalOgDescription} />
        <meta property="og:image" content={`${siteUrl}${ogImage}`} />
        {finalOgUrl && <meta property="og:url" content={finalOgUrl} />}
        <meta property="og:site_name" content="JAV LABS" />
        <meta property="og:locale" content="es_ES" />

        {/* Twitter Card */}
        <meta name="twitter:card" content={twitterCard} />
        <meta name="twitter:site" content={twitterSite} />
        <meta name="twitter:title" content={finalOgTitle} />
        <meta name="twitter:description" content={finalOgDescription} />
        <meta name="twitter:image" content={`${siteUrl}${ogImage}`} />

        {/* Canonical URL */}
        {finalCanonicalUrl && <link rel="canonical" href={finalCanonicalUrl} />}

        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#0d7ff2" />

        {/* robots */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      </Helmet>

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(jsonLdData)}
      </script>
    </>
  );
}
