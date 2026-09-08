import { images } from '../data/content'

export default function Editorial() {
  return <section className="editorial section" id="collection">
    <div className="editorial__intro reveal"><p className="eyebrow">02 / IN MOTION</p><h2>THE DAILY<br />RITUAL.</h2></div>
    <div className="editorial__grid"><a href="#shop" className="editorial__tile editorial__tile--tall"><img src={images.editorialOne} alt="Mujer realizando ejercicio, imagen placeholder" loading="lazy" /><span>TRAINING / 01</span></a><a href="#shop" className="editorial__tile"><img src={images.editorialTwo} alt="Atleta en movimiento, imagen placeholder" loading="lazy" /><span>STUDIO / 02</span></a></div>
  </section>
}
