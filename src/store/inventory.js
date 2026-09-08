import { products } from '../data/content.js'

export const stockKey = (productId, colorId, size) => `${productId}::${colorId}::${size}`
export const lineKey = line => line.type === 'set' ? `set:${line.setId}:${line.colorId}:${line.items.map(item => `${item.productId}-${item.size}`).sort().join('|')}` : `product:${line.productId}:${line.colorId}:${line.size}`

// La única tabla de inventario se deriva del catálogo comercial central.
export const initialStock = Object.fromEntries(products.flatMap(product => product.variants.flatMap(variant => Object.entries(variant.sizes).map(([size, stock]) => [stockKey(product.id, variant.colorId, size), stock]))))

export const getStock = (stock, productId, colorId, size) => stock[stockKey(productId, colorId, size)] ?? 0
export const reservedQuantity = (cart, productId, colorId, size, excludedLineKey) => cart.reduce((total, line) => {
  if (lineKey(line) === excludedLineKey) return total
  if (line.type === 'set') return total + (line.items.some(item => item.productId === productId && item.size === size) && line.colorId === colorId ? line.quantity : 0)
  return total + (line.productId === productId && line.colorId === colorId && line.size === size ? line.quantity : 0)
}, 0)
export const availableQuantity = (stock, cart, productId, colorId, size, excludedLineKey) => Math.max(0, getStock(stock, productId, colorId, size) - reservedQuantity(cart, productId, colorId, size, excludedLineKey))
