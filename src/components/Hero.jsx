import { images } from '../data/content'
import Icon from './Icon'

export default function Hero() {
  return <section className="hero" id="top">
    <img src={images.hero} alt="Atleta entrenando, imagen placeholder" />
    <div className="hero__shade"></div>
    <div className="hero__content reveal">
      <p className="eyebrow">PASTEL DOLLY / DROP 001</p>
      <h1>CREATE.<br />BUILD.<br />BECOME.</h1>
      <p className="hero__copy">Activewear para el proceso de convertirte en ti.</p>
      <a className="button button--light" href="/collections/pastel-dolly">VER COLECCIÓN <Icon name="arrow-up-right" /></a>
    </div>
    <p className="hero__side">CREATE · BUILD · BECOME</p>
  </section>
}
