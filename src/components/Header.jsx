import { useEffect, useRef, useState } from 'react'
import { useShop } from '../store/ShopContext'
import { categories } from '../data/content'
import { contactConfig, whatsappUrl } from '../data/config'
import Icon from './Icon'

export default function Header() {
  const [open, setOpen] = useState(false)
  const headerRef = useRef(null)
  const navRef = useRef(null)
  const { cart, setCartOpen } = useShop()
  const quantity = cart.reduce((total, item) => total + item.quantity, 0)
  const closeMenu = () => {
    setOpen(false)
    navRef.current?.querySelectorAll('details[open]').forEach(detail => { detail.open = false })
  }

  useEffect(() => {
    const closeOnRouteChange = () => closeMenu()
    const closeOnEscape = event => { if (event.key === 'Escape') closeMenu() }
    const closeOnOutsideClick = event => { if (open && !headerRef.current?.contains(event.target)) closeMenu() }
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

  return <><div className="announcement">ENVÍO GRATIS EN TODO GRECIA <span>·</span> PASTEL DOLLY / DROP 001</div><header className="header" ref={headerRef}><button className="menu-button" onClick={() => setOpen(current => !current)} aria-expanded={open} aria-controls="main-nav"><span className="sr-only">{open ? 'Cerrar menú' : 'Abrir menú'}</span><Icon name="menu" /></button><nav ref={navRef} id="main-nav" className={open ? 'nav nav--open' : 'nav'} aria-label="Navegación principal" onClick={event => { if (event.target.closest('a')) closeMenu() }}><details className="shop-menu"><summary>MUJER</summary><div className="mega-menu"><p>ROPA DEPORTIVA</p><a href="/shop">VER TODO</a>{categories.map(category => <a href={`/shop/${category.id}`} key={category.id}>{category.label.toUpperCase()}</a>)}<a href="/shop/sets">SETS</a></div></details><a href="/hombre">HOMBRE <span className="nav-coming-soon">PRÓXIMAMENTE</span></a><a href="/collections/pastel-dolly">PASTEL DOLLY</a><a href="/shop/sets">SETS</a><a href="/shop">NUEVO</a><a href="/#about">NOSOTROS</a><details className="mobile-contact"><summary>CONTACTO</summary><div className="mega-menu"><a href="/contacto">Ver contacto</a><a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">WhatsApp</a><a href={contactConfig.instagram} target="_blank" rel="noopener noreferrer">Instagram</a><a href={contactConfig.tiktok} target="_blank" rel="noopener noreferrer">TikTok</a></div></details></nav><a className="wordmark" href="/" aria-label="KREA, inicio">KREA</a><div className="header-actions"><button className="cart" onClick={() => setCartOpen(true)} aria-label={`Carrito, ${quantity} artículos`}><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 8.5h14l-1 12H6l-1-12Z" /><path d="M9 9V6a3 3 0 0 1 6 0v3" /></svg><b>{quantity}</b></button></div></header></>
}
