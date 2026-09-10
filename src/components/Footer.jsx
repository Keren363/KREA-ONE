import { contactConfig, whatsappUrl } from '../data/config'
import Icon from './Icon'

export default function Footer() {
  return <footer className="footer"><a className="wordmark" href="/">KREA</a><p className="footer__statement">CREATE. BUILD. BECOME.</p><div className="footer__columns"><div><p className="eyebrow">TIENDA</p><a href="/shop">Ver todo</a><a href="/collections/pastel-dolly">Pastel Dolly</a><a href="/shop/sets">Sets</a><a href="/contacto">Contacto</a></div><div><p className="eyebrow">SÍGUENOS</p><a href={contactConfig.instagram} target="_blank" rel="noopener noreferrer">Instagram <Icon name="arrow-up-right" /></a><a href={contactConfig.tiktok} target="_blank" rel="noopener noreferrer">TikTok <Icon name="arrow-up-right" /></a></div><div><p className="eyebrow">CONTACTO</p><a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">WhatsApp <Icon name="arrow-up-right" /></a><a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">{contactConfig.whatsappDisplay}</a></div></div><p className="footer__copyright">© {new Date().getFullYear()} KREA. TODOS LOS DERECHOS RESERVADOS.</p></footer>
}
