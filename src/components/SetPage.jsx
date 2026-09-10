import { useState } from 'react'
import { formatPrice, getProductById, getSet } from '../data/content'
import { useShop } from '../store/ShopContext'
import Icon from './Icon'

export default function SetPage({ slug }) {
  const set = getSet(slug)
  const { addSetToCart } = useShop()
  const [colorId, setColorId] = useState('pink-dolly')
  const [sizes, setSizes] = useState({})
  if (!set) return <main className="not-found section"><p className="eyebrow">404</p><h1>SET NO ENCONTRADO</h1><a className="button" href="/shop/sets">VER SETS</a></main>
  const items = set.items.map(getProductById)
  const colors = items[0].variants.map(variant => variant.colorId).filter(id => items.every(item => item.variants.some(variant => variant.colorId === id)))
  const activeColorId = colors.includes(colorId) ? colorId : colors[0]
  const currentVariants = items.map(item => item.variants.find(variant => variant.colorId === activeColorId))
  const gallery = currentVariants.flatMap(variant => variant.images)
  const selectedColor = currentVariants[0]
  const ready = items.every(item => sizes[item.id])
  return <main className="set-page product-page"><a href="/shop/sets" className="back-link"><Icon name="arrow-left" /> VOLVER A SETS</a><div className="product-layout"><div className="product-gallery set-gallery">{gallery.map((src, index) => <img src={src} alt={`${set.name}, imagen ${index + 1}`} loading={index ? 'lazy' : 'eager'} key={src} />)}</div><section className="product-details"><p className="eyebrow">PASTEL DOLLY / SET</p><h1>{set.name}</h1><div className="product-price-stack"><s>{formatPrice(set.price.normal)}</s><p className="product-price">{formatPrice(set.price.launch)}</p><p className="opening-price">PRECIO DE APERTURA</p></div><p className="set-description">{set.description}</p><div className="product-option"><p>COLOR: <b>{selectedColor.colorName}</b></p><div className="swatches">{colors.map(entry => { const variant = items[0].variants.find(item => item.colorId === entry); return <button title={variant.colorName} aria-label={`Color ${variant.colorName}`} className={entry === activeColorId ? 'selected' : ''} onClick={() => { setColorId(entry); setSizes({}) }} style={{ '--swatch': variant.hex }} key={entry}></button> })}</div></div><div className="set-size-list">{items.map((item, index) => { const variant = currentVariants[index]; return <div className="set-size-picker" key={item.id}><span>TALLA DEL {item.name.toUpperCase()}</span><div className="sizes">{Object.keys(variant.sizes).map(size => <button className={sizes[item.id] === size ? 'selected' : ''} onClick={() => setSizes(current => ({ ...current, [item.id]: size }))} key={size}>{size}</button>)}</div></div> })}</div><button className="add-button" disabled={!ready} onClick={() => addSetToCart(set, activeColorId, sizes)}>{ready ? 'AGREGAR SET AL CARRITO' : 'SELECCIONA LAS TALLAS'}</button><p className="shipping-copy">Envío gratuito en todo Grecia. Para otras ubicaciones se añadirá el costo correspondiente.</p><div className="set-includes"><p className="eyebrow">INCLUYE</p>{items.map(item => <p key={item.id}>{item.name}</p>)}</div></section></div></main>
}
