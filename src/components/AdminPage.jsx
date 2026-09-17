import { useEffect, useMemo, useState } from 'react'
import { products } from '../data/content.js'
import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase.js'
import { useShop } from '../store/ShopContext.jsx'
import { stockKey } from '../store/inventory.js'
import { navigate } from '../utils/navigation.js'

function makeRows(getVariantStock) {
  return products.flatMap((product) => product.variants.flatMap((variant) => Object.keys(variant.sizes).map((size) => ({
    key: stockKey(product.id, variant.colorId, size),
    productId: product.id,
    productName: product.name,
    colorId: variant.colorId,
    colorName: variant.colorName,
    size,
    image: variant.images[0],
    stock: getVariantStock(product.id, variant.colorId, size),
  }))))
}

export default function AdminPage() {
  const { getVariantStock, inventoryReady, inventoryError, refreshInventory } = useShop()
  const [authorized, setAuthorized] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [pending, setPending] = useState({})
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!isSupabaseConfigured) {
      navigate('/admin/login')
      return undefined
    }

    let active = true
    const verify = async () => {
      const client = getSupabaseClient()
      const { data } = await client.auth.getSession()
      if (!data.session) {
        navigate('/admin/login')
        return
      }
      const { data: profile } = await client.from('profiles').select('role').eq('id', data.session.user.id).maybeSingle()
      if (profile?.role !== 'admin') {
        await client.auth.signOut()
        navigate('/admin/login')
        return
      }
      if (active) {
        setAuthorized(true)
        setCheckingSession(false)
      }
    }
    verify()
    return () => { active = false }
  }, [])

  const rows = useMemo(() => makeRows(getVariantStock), [getVariantStock])
  const rowsWithEdits = rows.map((row) => ({ ...row, stock: pending[row.key] ?? row.stock ?? 0 }))
  const normalizedQuery = query.trim().toLocaleLowerCase('es-CR')
  const visibleRows = rowsWithEdits.filter((row) => {
    const matchesQuery = !normalizedQuery || `${row.productName} ${row.colorName} ${row.size}`.toLocaleLowerCase('es-CR').includes(normalizedQuery)
    const matchesFilter = filter === 'all' || filter === 'available' && row.stock > 0 || filter === 'low' && row.stock > 0 && row.stock <= 2 || filter === 'out' && row.stock === 0
    return matchesQuery && matchesFilter
  })
  const summary = useMemo(() => ({
    total: rowsWithEdits.reduce((total, row) => total + row.stock, 0),
    low: rowsWithEdits.filter((row) => row.stock > 0 && row.stock <= 2).length,
    out: rowsWithEdits.filter((row) => row.stock === 0).length,
  }), [rowsWithEdits])

  const setStock = (key, value) => {
    const parsed = Number.parseInt(value, 10)
    setPending((current) => ({ ...current, [key]: Number.isFinite(parsed) ? Math.max(0, parsed) : 0 }))
    setMessage('')
  }

  const adjustStock = (row, amount) => setStock(row.key, row.stock + amount)

  const saveChanges = async () => {
    const editedRows = rows.filter((row) => Object.hasOwn(pending, row.key))
    if (!editedRows.length) return

    setSaving(true)
    setMessage('')
    const payload = editedRows.map((row) => ({
      product_id: row.productId,
      color_id: row.colorId,
      size: row.size,
      stock: pending[row.key],
    }))
    const { error } = await getSupabaseClient().from('inventory').upsert(payload, { onConflict: 'product_id,color_id,size' })
    if (error) {
      setMessage('No pudimos actualizar el stock. Intenta nuevamente.')
    } else {
      setPending({})
      await refreshInventory()
      setMessage('Stock actualizado.')
    }
    setSaving(false)
  }

  const signOut = async () => {
    await getSupabaseClient().auth.signOut()
    navigate('/admin/login')
  }

  if (checkingSession || !authorized) return <main className="admin-shell"><p className="admin-loading">Verificando acceso…</p></main>

  return <main className="admin-shell"><section className="admin-dashboard"><header className="admin-header"><div><p className="admin-kicker">KREA ONE</p><h1>INVENTARIO</h1></div><button className="admin-signout" onClick={signOut}>CERRAR SESIÓN</button></header><div className="admin-summary"><article><span>UNIDADES TOTALES</span><b>{summary.total}</b></article><article><span>STOCK BAJO</span><b>{summary.low}</b></article><article><span>AGOTADOS</span><b>{summary.out}</b></article></div><div className="admin-controls"><label className="admin-search">Buscar producto, color o talla<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar" /></label><div className="admin-filter" role="group" aria-label="Filtrar inventario">{[['all', 'Todo'], ['available', 'Disponible'], ['low', 'Stock bajo'], ['out', 'Agotado']].map(([value, label]) => <button className={filter === value ? 'active' : ''} onClick={() => setFilter(value)} key={value}>{label}</button>)}</div></div>{!inventoryReady && <p className="admin-status">{inventoryError || 'Cargando disponibilidad…'}</p>}<div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Producto</th><th>Color</th><th>Talla</th><th>Stock</th><th>Acciones</th></tr></thead><tbody>{visibleRows.map((row) => <tr key={row.key}><td><div className="admin-product">{row.image && <img src={row.image} alt="" />}<span>{row.productName}</span></div></td><td>{row.colorName}</td><td>{row.size}</td><td><input className="admin-stock-input" type="number" min="0" inputMode="numeric" value={row.stock} onChange={(event) => setStock(row.key, event.target.value)} aria-label={`Stock de ${row.productName}, ${row.colorName}, talla ${row.size}`} /></td><td><div className="admin-actions"><button onClick={() => adjustStock(row, -1)} aria-label={`Reducir stock de ${row.productName}`}>−</button><button onClick={() => adjustStock(row, 1)} aria-label={`Aumentar stock de ${row.productName}`}>+</button></div></td></tr>)}</tbody></table>{visibleRows.length === 0 && <p className="admin-empty">No encontramos variantes con esos filtros.</p>}</div><footer className="admin-footer">{message && <p className="admin-status" role="status">{message}</p>}<button className="admin-save" disabled={saving || Object.keys(pending).length === 0} onClick={saveChanges}>{saving ? 'GUARDANDO…' : 'GUARDAR CAMBIOS'}</button></footer></section></main>
}
