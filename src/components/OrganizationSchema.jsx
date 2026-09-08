import { contactConfig } from '../data/config'
export default function OrganizationSchema() { const schema = { '@context': 'https://schema.org', '@type': 'Organization', name: 'KREA ONE', url: 'https://kreaone.cr', sameAs: [contactConfig.instagram, contactConfig.tiktok] }; return <script type="application/ld+json">{JSON.stringify(schema)}</script> }
