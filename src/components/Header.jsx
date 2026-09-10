import { useEffect, useRef, useState } from 'react'
import { useShop } from '../store/ShopContext'
import { categories } from '../data/content'
import { contactConfig, whatsappUrl } from '../data/config'
import { navigate } from '../utils/navigation'
import Icon from './Icon'

export default function Header() {
  const [open, setOpen] = useState(false)
  const headerRef = useRef(null)
  const navRef = useRef(null)
  const { cart, setCartOpen } = useShop()
  const quantity = cart.reduce((total, item) => total + item.quantity, 0)

  const closeMenu = () => {
    setOpen(false)
    navRef.current?.querySelectorAll('details[open]').forEach(detail => {
      detail.open = false
    })
  }

  const handleMobileNavigation = (event, href) => {
    if (
      event.defaultPrevented ||
      (event.button != null && event.button !== 0) ||
      event.metaKey || event.ctrlKey || event.shiftKey || event.altKey
    ) return

    event.preventDefault()
    closeMenu()
    navigate(href)
  }

  const mobileLink = href => ({
    href,
    onClick: event => handleMobileNavigation(event, href),
  })

  useEffect(() => {
    const closeOnRouteChange = () => closeMenu()
    const closeOnEscape = event => {
      if (event.key === 'Escape') closeMenu()
    }
    const closeOnOutsideClick = event => {
      if (open && !headerRef.current?.contains(event.target)) closeMenu()
    }

    window.addEventListener('hashchange', closeOnRouteChange)
    window.addEventListener('popstate', closeOnRouteChange)
    document.addEventListener('keydown', closeOnEscape)
    document.addEventListener('pointerdown', closeOnOutsideClick)
    return () => {
      window.removeEventListener('hashchange', closeOnRouteChange)
      window.removeEventListener('popstate', closeOnRouteChange)
      document.removeEventListener('keydown', closeOnEscape)
      document.removeEventListener('pointerdown', closeOnOutsideClick)
    }
  }, [open])

  return <>
    <div className="announcement">ENVÍO GRATIS EN TODO GRECIA <span>·</span> PASTEL DOLLY / DROP 001</div>
    <header className="header" ref={headerRef}>
      <button
        className="menu-button"
        onClick={() => setOpen(current => !current)}
        aria-expanded={open}
        aria-controls="main-nav"
      >
        <span className="sr-only">{open ? 'Cerrar menú' : 'Abrir menú'}</span>
        <Icon name="menu" />
      </button>
      <nav ref={navRef} id="main-nav" className={open ? 'nav nav--open' : 'nav'} aria-label="Navegación principal">
        <details className="shop-menu">
          <summary>MUJER</summary>
          <div className="mega-menu">
            <p>ROPA DEPORTIVA</p>
            <a {...mobileLink('/shop')}>VER TODO</a>
            {categories.map(category => (
              <a {...mobileLink(`/shop/${category.id}`)} key={category.id}>{category.label.toUpperCase()}</a>
            ))}
            <a {...mobileLink('/shop/sets')}>SETS</a>
          </div>
        </details>
        <a {...mobileLink('/hombre')}>HOMBRE <span className="nav-coming-soon">PRÓXIMAMENTE</span></a>
        <a {...mobileLink('/collections/pastel-dolly')}>PASTEL DOLLY</a>
        <a {...mobileLink('/shop/sets')}>SETS</a>
        <a {...mobileLink('/shop')}>NUEVO</a>
        <a {...mobileLink('/#about')}>NOSOTROS</a>
        <details className="mobile-contact">
          <summary>CONTACTO</summary>
          <div className="mega-menu">
            <a {...mobileLink('/contacto')}>Ver contacto</a>
            <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" onClick={closeMenu}>WhatsApp</a>
            <a href={contactConfig.instagram} target="_blank" rel="noopener noreferrer" onClick={closeMenu}>Instagram</a>
            <a href={contactConfig.tiktok} target="_blank" rel="noopener noreferrer" onClick={closeMenu}>TikTok</a>
          </div>
        </details>
      </nav>
      <a className="wordmark" href="/" aria-label="KREA, inicio">KREA</a>
      <div className="header-actions">
        <button className="cart" onClick={() => setCartOpen(true)} aria-label={`Carrito, ${quantity} artículos`}>
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="M5 8.5h14l-1 12H6l-1-12Z" />
            <path d="M9 9V6a3 3 0 0 1 6 0v3" />
          </svg>
          <b>{quantity}</b>
        </button>
      </div>
    </header>
  </>
}
