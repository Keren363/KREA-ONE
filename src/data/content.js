const asset = file => new URL(`../../images/${file}`, import.meta.url).href

// Centro de configuración comercial. Edita aquí precios, stock, fotos, colores y ciudad.
export const shopConfig = { freeShippingCanton: 'Grecia', currency: 'CRC' }
export const formatPrice = price => price == null ? 'PRECIO PRÓXIMAMENTE' : `₡${String(Math.round(Number(price))).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`
export const getShipping = canton => canton.trim().toLocaleLowerCase('es-CR') === shopConfig.freeShippingCanton.toLocaleLowerCase('es-CR') ? { label: 'GRATIS EN GRECIA', detail: 'Envío gratuito en todo Grecia.', isFree: true } : { label: 'POR CALCULAR SEGÚN UBICACIÓN', detail: 'El costo de envío será confirmado por WhatsApp según tu ubicación.', isFree: false }
export const categories = [{ id: 'shorts', label: 'Shorts' }, { id: 'sports-bras', label: 'Sports Bras' }, { id: 'leggings', label: 'Leggings' }, { id: 'tops', label: 'Tops' }, { id: 'one-pieces', label: 'One Pieces' }, { id: 'capris', label: 'Capris' }]
// Los IDs se usan para stock y carrito; los nombres visibles no son claves de negocio.
export const colorOptions = {
  'pink-dolly': { name: 'Pink Dolly', hex: '#e1a4b2' },
  'blue-dolly': { name: 'Blue Dolly', hex: '#a8d3e2' },
  'contrast-wine': { name: 'Contrast Wine', hex: '#622634' },
}
const variant = (colorId, files, sizes) => ({ colorId, colorName: colorOptions[colorId].name, hex: colorOptions[colorId].hex, images: files.map(asset), sizes })
const standardSizes = { XS: 1, S: 2, M: 2 }

export const products = [
  { id: 'short', slug: 'cloud-kiss-shorts', name: 'Cloud Kiss Shorts', category: 'shorts', collection: 'pastel-dolly', badge: 'APERTURA', description: 'Short de performance para entrenar y moverte con libertad.', material: '78% Nylon · 22% Spandex', fit: 'Ajuste de soporte suave.', price: { normal: 10900, launch: 8950, discount: null, endsAt: null }, complement: 'sports-bra', set: 'cloud-kiss-set', variants: [variant('pink-dolly', ['SHORTROSAADELANTE .png', 'SHORTROSAATRAS.png'], standardSizes), variant('blue-dolly', ['SHORTCELESTEADELANTE.png', 'SHORTCELESTEATRAS.png'], standardSizes)] },
  { id: 'sports-bra', slug: 'dreamline-bra', name: 'Dreamline Bra', category: 'sports-bras', collection: 'pastel-dolly', badge: 'APERTURA', description: 'Bra deportivo ligero y funcional para tu rutina.', material: '78% Nylon · 22% Spandex', fit: 'Soporte medio.', price: { normal: 10900, launch: 8950, discount: null, endsAt: null }, complement: 'short', set: 'cloud-kiss-set', variants: [variant('pink-dolly', ['BRAROSA.png'], standardSizes), variant('blue-dolly', ['BRACELESTE.jpeg'], standardSizes)] },
  { id: 'leggings', slug: 'dolly-sculpt-leggings', name: 'Dolly Sculpt Leggings', category: 'leggings', collection: 'pastel-dolly', badge: 'APERTURA', description: 'Legging de largo completo con compresión flexible.', material: '90% Nylon · 10% Spandex', fit: 'Ajuste de segunda piel.', price: { normal: 11900, launch: 9950, discount: null, endsAt: null }, complement: 'top', set: 'dolly-sculpt-set', variants: [variant('pink-dolly', ['legginsrosa.png'], standardSizes), variant('blue-dolly', ['legginsceleste.png'], standardSizes)] },
  { id: 'top', slug: 'softform-top', name: 'Softform Top', category: 'tops', collection: 'pastel-dolly', badge: 'APERTURA', description: 'Top deportivo de líneas limpias para completar el look.', material: '90% Nylon · 10% Spandex', fit: 'Ajuste ceñido.', price: { normal: 11900, launch: 9950, discount: null, endsAt: null }, complement: 'leggings', set: 'dolly-sculpt-set', variants: [variant('pink-dolly', ['TOPROSAADELANTE.png', 'TOPROSAATRAS.png'], standardSizes), variant('blue-dolly', ['TOPCELESTEADELANTE.png', 'TOPCELESTEATRAS.png'], standardSizes)] },
  { id: 'one-piece', slug: 'dolly-one-piece', name: 'Dolly One Piece', category: 'one-pieces', collection: 'pastel-dolly', badge: 'APERTURA', description: 'Jumpsuit deportivo corto de silueta depurada.', material: '90% Nylon · 10% Spandex', fit: 'Ajuste de una pieza.', price: { normal: 27900, launch: 22900, discount: null, endsAt: null }, variants: [variant('pink-dolly', ['ONEPIECE ROSA ADELANTE .png', 'ONEPIECEROSAATRAS .png', 'ONEPIECEROSA.png'], { XS: 1, S: 1, M: 2 })] },
  { id: 'capri', slug: 'contrast-capri', name: 'Contrast Capri', category: 'capris', collection: 'pastel-dolly', badge: 'DROP 001', description: 'Legging capri para movimiento diario.', material: 'Material pendiente de confirmar', fit: 'Largo debajo de la rodilla.', price: { normal: null, launch: null, discount: null, endsAt: null }, variants: [variant('contrast-wine', [], { S: 1, M: 1 })] },
]

export const sets = [
  { id: 'cloud-kiss-set', slug: 'cloud-kiss-set', name: 'Cloud Kiss Set', items: ['sports-bra', 'short'], description: 'Dos piezas. Un mismo look. Elige tu talla para cada una.', price: { normal: 21800, launch: 17900 } },
  { id: 'dolly-sculpt-set', slug: 'dolly-sculpt-set', name: 'Dolly Sculpt Set', items: ['top', 'leggings'], description: 'Combínalo completo o hazlo a tu manera.', price: { normal: 23800, launch: 19900 } },
]
export const getProduct = slug => products.find(product => product.slug === slug)
export const getProductById = id => products.find(product => product.id === id)
export const getSet = slug => sets.find(set => set.slug === slug)
export const images = { hero: asset('ONEPIECE ROSA ADELANTE .png'), statement: asset('TOPCELESTEADELANTE.png'), editorialOne: asset('SHORTROSAADELANTE .png'), editorialTwo: asset('ONEPIECECELESTEADELANTE.png'), instagram: [asset('BRAROSA.png'), asset('legginsceleste.png'), asset('TOPROSAADELANTE.png'), asset('SHORTCELESTEADELANTE.png')] }
