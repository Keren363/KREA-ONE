import { useState } from 'react'
import { formatPrice, getProduct, getProductById, sets } from '../data/content'
import { useShop } from '../store/ShopContext'
import ProductCard from './ProductCard'

export default function ProductPage({ slug }) {
  const product = getProduct(slug)
  const { addToCart } = useShop()
  const [colorId, setColorId] = useState(product?.variants[0]?.colorId ?? null)
  const [size, setSize] = useState(null)
  const [imageIndex, setImageIndex] = useState(0)
  if (!product) return <main className="not-found section"><p className="eyebrow">404</p><h1>PRODUCTO NO ENCONTRADO</h1><a className="button" href="/">VOLVER A SHOP</a></main>
  const variant = product.variants.find(item => item.colorId === colorId) ?? product.variants[0]
  const gallery = variant.images
  const complement = product.complement && getProductById(product.complement)
  const set = product.set && sets.find(item => item.id === product.set)
  const changeColor = next => { setColorId(next); setSize(null); setImageIndex(0) }
  const buttonLabel = !colorId ? 'SELECCIONA COLOR' : !size ? 'SELECCIONA TALLA' : 'AGREGAR AL CARRITO'

  return <main className="product-page">
    <a href="/" className="back-link">← VOLVER A SHOP</a>
    <div className="product-layout">
      <div className={`product-gallery ${!gallery.length ? 'product-gallery--pending' : ''}`}>
        {gallery.length ? <><img src={gallery[imageIndex]} alt={`${product.name} ${variant.colorName}`} /><p className="gallery-count">{imageIndex + 1} / {gallery.length}</p><div className="gallery-dots">{gallery.map((_, index) => <button className={index === imageIndex ? 'active' : ''} onClick={() => setImageIndex(index)} aria-label={`Ver imagen ${index + 1}`} key={index}></button>)}</div><div className="gallery-thumbs">{gallery.map((src, index) => <button onClick={() => setImageIndex(index)} className={index === imageIndex ? 'active' : ''} key={src}><img src={src} alt="" /></button>)}</div></> : <p>FOTOGRAFÍA DE PRODUCTO<br />PRÓXIMAMENTE</p>}
      </div>
      <section className="product-details">
        <p className="eyebrow">PASTEL DOLLY / DROP 001</p><h1>{product.name}</h1><div className="product-price-stack">{product.price.normal && <s>{formatPrice(product.price.normal)}</s>}<p className="product-price">{formatPrice(product.price.launch)}</p><p className="opening-price">PRECIO DE APERTURA</p></div>
        <div className="product-option"><p>COLOR: <b>{colorId ? variant.colorName : 'SELECCIONA UN COLOR'}</b></p><div className="swatches">{product.variants.map(item => <button title={item.colorName} aria-label={`Color ${item.colorName}`} className={item.colorId === colorId ? 'selected' : ''} onClick={() => changeColor(item.colorId)} style={{ '--swatch': item.hex }} key={item.colorId}></button>)}</div></div>
        <div className="product-option"><div className="option-row"><p>TALLA</p><details className="size-guide"><summary>GUÍA DE TALLAS</summary><p>Las medidas exactas serán publicadas al confirmar la guía del proveedor. Para ayuda inmediata, contáctanos por WhatsApp.</p></details></div><div className="sizes">{Object.keys(variant.sizes).map(item => <button className={item === size ? 'selected' : ''} onClick={() => setSize(item)} key={item}>{item}</button>)}</div></div>
        <p className="stock-message">{!colorId ? 'SELECCIONA UN COLOR' : !size ? 'SELECCIONA UNA TALLA' : ''}</p>
        <div className="mobile-add"><button className="add-button" disabled={!colorId || !size} onClick={() => addToCart(product, colorId, size)}>{buttonLabel}</button></div>
        {set && <div className="set-action"><p className="eyebrow">COMPLETA EL LOOK</p><p>{set.name}</p><a className="text-link" href={`/sets/${set.slug}`}>COMPRAR EL SET <span>↗</span></a></div>}
        <div className="product-copy"><dl><div><dt>DESCRIPCIÓN</dt><dd>{product.description}</dd></div><div><dt>ENVÍO</dt><dd>Gratis en todo Grecia. Fuera de Grecia, el costo se confirma por WhatsApp.</dd></div></dl></div>
      </section>
    </div>
    {complement && <section className="complete-look"><div><p className="eyebrow">01 / COMPLETA EL LOOK</p><h2>COMPLETA<br />EL LOOK.</h2></div><ProductCard product={complement} selectedColor={colorId} /></section>}
  </main>
}
