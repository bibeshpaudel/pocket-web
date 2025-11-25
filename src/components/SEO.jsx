import { Helmet } from 'react-helmet-async';

export default function SEO({ title, description, keywords, url }) {
  const siteTitle = 'Pocket - Developer Tools';
  const fullTitle = title ? `${title} | Pocket` : siteTitle;
  const siteUrl = 'https://bibeshpaudel.github.io/pocket-web';
  const currentUrl = url ? `${siteUrl}${url}` : siteUrl;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description || 'A collection of essential developer tools.'} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={currentUrl} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || 'A collection of essential developer tools.'} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:site_name" content="Pocket" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || 'A collection of essential developer tools.'} />
    </Helmet>
  );
}
