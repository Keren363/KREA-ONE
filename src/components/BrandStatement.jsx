import { images } from '../data/content'
import Icon from './Icon'

export default function BrandStatement() {
  return <section className="statement section" id="about">
    <div className="statement__image"><img src={images.statement} alt="Entrenamiento al aire libre" loading="eager" /></div>
    <div className="statement__copy reveal"><p className="eyebrow">¿DE DÓNDE NACE KREA?</p><h2>CREATE.<br /><em>BUILD. BECOME.</em></h2><p>KREA nace de eso que buscamos cada vez que vamos al gym: crear, construir y ser. No se trata solo de estar más fuertes, sino de disfrutar el proceso de moldear lo que queremos construir.</p><p>También son amistades, sonrisas y momentos que ayudan a salir de los días difíciles. KREA quiere acompañarte en ese camino.</p><a href="#collection" className="button">DESCUBRE EL DROP <Icon name="arrow-up-right" /></a></div>
  </section>
}
