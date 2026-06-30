import { Helmet } from 'react-helmet-async';

export default function SEO({
  title = 'JAV LABS | Automatización con IA',
  description = 'JAV LABS - Agencia de automatización con IA en Ecuador. Automatizamos procesos, integramos sistemas y creamos agentes de IA para empresas.',
  ogTitle,
  ogDescription,
  ogImage = '/Logo2.png',
  ogUrl,
  canonicalUrl,
  twitterCard = 'summary_large_image',

  // Structured Data
  breadcrumbItems,
  faqSchema,
  serviceName,
  serviceDescription,
  servicePrice,
  servicePriceCurrency = 'USD',
  customJsonLd,
}) {
  const finalOgTitle = ogTitle || title;
  const finalOgDescription = ogDescription || description;
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://javlabsautomatic.com';
  const finalCanonicalUrl = canonicalUrl ? `${siteUrl}${canonicalUrl}` : undefined;
  const finalOgUrl = ogUrl ? `${siteUrl}${ogUrl}` : undefined;

  const jsonLdData = {
    '@context': 'https://schema.org',
    '@graph': [],
    ...(customJsonLd || {}),
  };

  if (!jsonLdData['@graph']) {
    jsonLdData['@graph'] = [];
  }

  const organizationSchema = {
    '@type': 'Organization',
    name: 'JAV LABS',
    description,
    url: siteUrl,
    logo: `${siteUrl}/Logo2.png`,
    image: `${siteUrl}/Logo2.png`,
    foundingDate: '2025-01-01',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Ambato',
      addressRegion: 'Tungurahua',
      addressCountry: 'EC',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+593967685172',
      contactType: 'customer service',
      email: 'jorge.arias.amauta@gmail.com',
      areaServed: { '@type': 'Country', name: 'Ecuador' },
      availableLanguage: ['es'],
    },
    sameAs: [
      // Agrega aquí los perfiles de redes sociales cuando estén disponibles:
      // 'https://www.linkedin.com/company/jav-labs',
      // 'https://www.instagram.com/jav_labs',
      // 'https://www.facebook.com/javlabs',
    ],
  };
  jsonLdData['@graph'].push(organizationSchema);

  if (breadcrumbItems && breadcrumbItems.length > 0) {
    jsonLdData['@graph'].push({
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbItems.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: `${siteUrl}${item.url}`,
      })),
    });
  }

  if (faqSchema && faqSchema.length > 0) {
    jsonLdData['@graph'].push({
      '@type': 'FAQPage',
      mainEntity: faqSchema.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer },
      })),
    });
  }

  if (serviceName) {
    jsonLdData['@graph'].push({
      '@type': 'Service',
      name: serviceName,
      description: serviceDescription || description,
      provider: { '@type': 'Organization', name: 'JAV LABS' },
      areaServed: { '@type': 'Country', name: 'Ecuador' },
      ...(servicePrice && {
        offers: {
          '@type': 'Offer',
          price: servicePrice,
          priceCurrency: servicePriceCurrency,
          availability: 'https://schema.org/InStock',
        },
      }),
    });
  }

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />

      <meta property="og:type" content="website" />
      <meta property="og:title" content={finalOgTitle} />
      <meta property="og:description" content={finalOgDescription} />
      <meta property="og:image" content={`${siteUrl}${ogImage}`} />
      {finalOgUrl && <meta property="og:url" content={finalOgUrl} />}
      <meta property="og:site_name" content="JAV LABS" />
      <meta property="og:locale" content="es_ES" />

      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={finalOgTitle} />
      <meta name="twitter:description" content={finalOgDescription} />
      <meta name="twitter:image" content={`${siteUrl}${ogImage}`} />

      {finalCanonicalUrl && <link rel="canonical" href={finalCanonicalUrl} />}

      <script type="application/ld+json">
        {JSON.stringify(jsonLdData)}
      </script>
    </Helmet>
  );
}
