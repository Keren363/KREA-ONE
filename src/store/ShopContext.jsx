import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { isSupabaseConfigured, supabase } from '../lib/supabase.js'
import { getProductById } from '../data/content.js'
import { lineKey, stockKey } from './inventory.js'

const ShopContext = createContext(null)
const CART_STORAGE_KEY = 'krea-cart-v4'

function loadCart() {
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

function lineUsesVariant(line, productId, colorId, size) {
  if (line.type === 'set') {
    return line.colorId === colorId && line.items.some((item) => item.productId === productId && item.size === size)
  }

  return line.productId === productId && line.colorId === colorId && line.size === size
}

export function ShopProvider({ children }) {
  const [cart, setCart] = useState(loadCart)
  const [isCartOpen, setCartOpen] = useState(false)
  const [notice, setNotice] = useState('')
  const [inventory, setInventory] = useState({})
  const [inventoryReady, setInventoryReady] = useState(false)
  const [inventoryError, setInventoryError] = useState('')

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
    } catch {
      // The cart remains usable if browser storage is unavailable.
    }
  }, [cart])

  const refreshInventory = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) {
      setInventoryReady(false)
      setInventoryError('No pudimos cargar la disponibilidad en este momento.')
      return
    }

    const { data, error } = await supabase
      .from('inventory')
      .select('product_id, color_id, size, stock')

    if (error) {
      setInventoryReady(false)
      setInventoryError('No pudimos cargar la disponibilidad en este momento.')
      return
    }

    setInventory(Object.fromEntries(data.map((row) => [stockKey(row.product_id, row.color_id, row.size), row.stock])))
    setInventoryReady(true)
    setInventoryError('')
  }, [])

  useEffect(() => {
    refreshInventory()

    if (!supabase) return undefined

    const channel = supabase
      .channel('krea-inventory')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'inventory' }, refreshInventory)
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [refreshInventory])

  const getVariantStock = useCallback((productId, colorId, size) => {
    if (!inventoryReady) return null
    const key = stockKey(productId, colorId, size)
    return Object.hasOwn(inventory, key) ? inventory[key] : undefined
  }, [inventory, inventoryReady])

  const reservedQuantity = useCallback((productId, colorId, size, excludedLineKey) => cart.reduce((total, line) => {
    if (excludedLineKey && lineKey(line) === excludedLineKey) return total
    return lineUsesVariant(line, productId, colorId, size) ? total + line.quantity : total
  }, 0), [cart])

  const getAvailableQuantity = useCallback((productId, colorId, size, excludedLineKey) => {
    const stock = getVariantStock(productId, colorId, size)
    if (stock === null || stock === undefined) return null
    return Math.max(0, stock - reservedQuantity(productId, colorId, size, excludedLineKey))
  }, [getVariantStock, reservedQuantity])

  const getLineMaxQuantity = useCallback((line) => {
    const key = lineKey(line)
    const variants = line.type === 'set'
      ? line.items.map((item) => ({ productId: item.productId, colorId: line.colorId, size: item.size }))
      : [{ productId: line.productId, colorId: line.colorId, size: line.size }]
    const availability = variants.map((variant) => getAvailableQuantity(
      variant.productId,
      variant.colorId,
      variant.size,
      key,
    ))

    return availability.some((value) => value === null) ? null : Math.min(...availability)
  }, [getAvailableQuantity])

  const addToCart = useCallback((product, variant, size) => {
    const available = getAvailableQuantity(product.id, variant.colorId, size)
    if (available === null) {
      setNotice('Estamos cargando la disponibilidad. Intenta nuevamente.')
      return false
    }
    if (available < 1) {
      setNotice('Esta talla ya no está disponible.')
      return false
    }

    const line = {
      type: 'product',
      productId: product.id,
      productName: product.name,
      collection: product.collection,
      colorId: variant.colorId,
      colorName: variant.colorName,
      size,
      image: variant.images[0],
      price: product.price.launch,
      quantity: 1,
    }
    const key = lineKey(line)

    setCart((current) => {
      const existing = current.find((item) => lineKey(item) === key)
      return existing
        ? current.map((item) => lineKey(item) === key ? { ...item, quantity: item.quantity + 1 } : item)
        : [...current, line]
    })
    setNotice('Agregado al carrito')
    setCartOpen(true)
    return true
  }, [getAvailableQuantity])

  const addSetToCart = useCallback((set, color, selections) => {
    const missingSelection = set.items.some((productId) => !selections[productId])
    if (missingSelection) {
      setNotice('Selecciona las tallas de ambas piezas')
      return false
    }

    const unavailableItem = set.items.find((productId) => getAvailableQuantity(productId, color.colorId, selections[productId]) !== null && getAvailableQuantity(productId, color.colorId, selections[productId]) < 1)
    if (unavailableItem) {
      setNotice(`La talla seleccionada para ${getProductById(unavailableItem)?.name ?? 'esta pieza'} ya no está disponible.`)
      return false
    }
    if (set.items.some((productId) => getAvailableQuantity(productId, color.colorId, selections[productId]) === null)) {
      setNotice('Estamos cargando la disponibilidad. Intenta nuevamente.')
      return false
    }

    const line = {
      type: 'set',
      setId: set.id,
      productName: set.name,
      collection: set.collection,
      colorId: color.colorId,
      colorName: color.colorName,
      image: color.images[0],
      price: set.price.launch,
      quantity: 1,
      items: set.items.map((productId) => {
        const product = getProductById(productId)
        return { productId, name: product?.name ?? 'Producto', label: product?.name ?? 'Producto', size: selections[productId] }
      }),
    }
    const key = lineKey(line)

    setCart((current) => {
      const existing = current.find((item) => lineKey(item) === key)
      return existing
        ? current.map((item) => lineKey(item) === key ? { ...item, quantity: item.quantity + 1 } : item)
        : [...current, line]
    })
    setNotice('Set agregado al carrito')
    setCartOpen(true)
    return true
  }, [getAvailableQuantity])

  const updateQuantity = useCallback((key, quantity) => {
    if (quantity <= 0) {
      setCart((current) => current.filter((line) => lineKey(line) !== key))
      return
    }

    const line = cart.find((item) => lineKey(item) === key)
    if (!line) return
    const maximum = getLineMaxQuantity(line)
    if (maximum === null) {
      setNotice('Estamos cargando la disponibilidad. Intenta nuevamente.')
      return
    }
    if (maximum < quantity) {
      setNotice('No hay más unidades disponibles para esta selección.')
    }

    setCart((current) => current.map((item) => lineKey(item) === key
      ? { ...item, quantity: Math.min(quantity, maximum) }
      : item))
  }, [cart, getLineMaxQuantity])

  const removeFromCart = useCallback((key) => {
    setCart((current) => current.filter((line) => lineKey(line) !== key))
  }, [])

  const clearCart = useCallback(() => setCart([]), [])

  const cartCount = useMemo(() => cart.reduce((total, item) => total + item.quantity, 0), [cart])
  const cartSubtotal = useMemo(() => cart.reduce((total, item) => total + item.price * item.quantity, 0), [cart])

  const value = useMemo(() => ({
    cart,
    cartCount,
    cartSubtotal,
    isCartOpen,
    notice,
    inventoryReady,
    inventoryError,
    addToCart,
    addSetToCart,
    updateQuantity,
    removeFromCart,
    removeLine: removeFromCart,
    clearCart,
    setCartOpen,
    setNotice,
    getVariantStock,
    getLineMaxQuantity,
    refreshInventory,
    lineKey,
  }), [cart, cartCount, cartSubtotal, isCartOpen, notice, inventoryReady, inventoryError, addToCart, addSetToCart, updateQuantity, removeFromCart, clearCart, getVariantStock, getLineMaxQuantity, refreshInventory])

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}

export function useShop() {
  const context = useContext(ShopContext)
  if (!context) throw new Error('useShop debe usarse dentro de ShopProvider')
  return context
}
