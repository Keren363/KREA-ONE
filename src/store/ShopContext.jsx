import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { lineKey } from './inventory'

const ShopContext = createContext(null)
const load = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback } catch { return fallback } }

export function ShopProvider({ children }) {
  // El stock comercial se conserva en los datos, pero no restringe la compra.
  // La disponibilidad final se confirma personalmente por WhatsApp.
  const [cart, setCart] = useState(() => load('krea-cart-v4', [])); const [isCartOpen, setCartOpen] = useState(false); const [notice, setNotice] = useState('')
  const addToCart = (product, colorId, size) => { const key = `product:${product.id}:${colorId}:${size}`; setCart(current => { const existing = current.find(line => lineKey(line) === key); return existing ? current.map(line => lineKey(line) === key ? { ...line, quantity: line.quantity + 1 } : line) : [...current, { type: 'product', productId: product.id, colorId, size, quantity: 1 }] }); setNotice(`${product.name} agregado al carrito.`); setCartOpen(true); return true }
  const addSetToCart = (set, colorId, selections) => { if (set.items.some(productId => !selections[productId])) return false; const items = set.items.map(productId => ({ productId, size: selections[productId] })); const key = lineKey({ type: 'set', setId: set.id, colorId, items }); setCart(current => { const existing = current.find(line => lineKey(line) === key); return existing ? current.map(line => lineKey(line) === key ? { ...line, quantity: line.quantity + 1 } : line) : [...current, { type: 'set', setId: set.id, colorId, items, quantity: 1 }] }); setNotice(`${set.name} agregado al carrito.`); setCartOpen(true); return true }
  const updateQuantity = (key, quantity) => { setCart(current => { const line = current.find(item => lineKey(item) === key); if (!line) return current; if (quantity <= 0) return current.filter(item => lineKey(item) !== key); return current.map(item => lineKey(item) === key ? { ...item, quantity } : item) }) }
  const removeLine = key => setCart(current => current.filter(line => lineKey(line) !== key))
  const clearCart = () => setCart([])
  const value = useMemo(() => ({ cart, addToCart, addSetToCart, updateQuantity, removeLine, clearCart, isCartOpen, setCartOpen, lineKey, notice, setNotice }), [cart, isCartOpen, notice])
  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}
export const useShop = () => useContext(ShopContext)
