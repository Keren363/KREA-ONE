import { useState } from 'react'
import { formatPrice } from '../data/content'
import { handleInternalNavigation } from '../utils/navigation'

export default function ProductCard({ product, selectedColor }) {
  const [previewColorId, setPreviewColorId] = useState(selectedColor ?? product.variants[0].colorId)
  const preview = product.variants.find(item => item.colorId === previewColorId) ?? product.variants[0]
  const front = preview.images[0]; const back = preview.images[1]
  const href = `/products/${product.slug}`

  return <article className="product-card">
    <a className="product-card__main-link" href={href} onClick={event => handleInternalNavigation(event, href)}>
      <div className={`product-card__image ${!front ? 'product-card__image--pending' : ''}`}>
        {front ? <><img src={front} alt={`${product.name} ${preview.colorName}`} loading="lazy" /><img className="product-card__hover" src={back ?? front} alt="" loading="lazy" /></> : <span className="pending-image">IMAGEN<br />PRÓXIMAMENTE</span>}
        <b>{product.badge}</b>
      </div>
      <div className="product-card__info"><div><h3>{product.name}</h3><div className="price-stack">{product.price.normal && <s>{formatPrice(product.price.normal)}</s>}<strong>{formatPrice(product.price.launch)}</strong><small>PRECIO DE APERTURA</small></div></div></div>
      <span className="text-link">VER PIEZA <span>↗</span></span>
    </a>
    <div className="card-swatches" aria-label={`Previsualizar color: ${product.variants.map(item => item.colorName).join(', ')}`}>{product.variants.map(item => <button type="button" title={`Ver ${item.colorName}`} aria-label={`Previsualizar ${item.colorName}`} aria-pressed={item.colorId === preview.colorId} className={item.colorId === preview.colorId ? 'selected' : ''} onClick={() => setPreviewColorId(item.colorId)} style={{ '--swatch': item.hex }} key={item.colorId}></button>)}</div>
  </article>
}
