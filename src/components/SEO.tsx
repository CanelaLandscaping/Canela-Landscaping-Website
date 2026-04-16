import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
}

const SEO = ({ title, description, canonical }: SEOProps) => {
  const { i18n } = useTranslation();
  const lang = i18n.language.startsWith('en') ? 'en' : 'es';

  // Default SEO fallbacks
  const defaultTitle = "Canela Landscaping & Snow Plow";
  const defaultDescription = i18n.language.startsWith('en') 
    ? "Premium landscaping, snow plowing, and outdoor maintenance services in Denver, Colorado." 
    : "Servicios de jardinería, remoción de nieve y mantenimiento de exteriores en Denver, Colorado.";

  const siteTitle = title ? `${title} | Canela Landscaping` : defaultTitle;
  const siteDescription = description || defaultDescription;

  return (
    <Helmet htmlAttributes={{ lang }}>
      <title>{siteTitle}</title>
      <meta name="description" content={siteDescription} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={siteDescription} />
      {canonical && <meta property="og:url" content={canonical} />}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={siteDescription} />

      {canonical && <link rel="canonical" href={canonical} />}
    </Helmet>
  );
};

export default SEO;
