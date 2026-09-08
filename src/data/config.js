export const contactConfig = {
  instagram: 'https://www.instagram.com/krea.one.cr',
  tiktok: 'https://www.tiktok.com/@krea.one.cr',
  whatsappDisplay: '+506 7276 5621',
  whatsappNumber: '50672765621',
}

export const whatsappUrl = message => `https://wa.me/${contactConfig.whatsappNumber}${message ? `?text=${encodeURIComponent(message)}` : ''}`
