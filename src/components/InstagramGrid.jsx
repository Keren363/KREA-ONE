import { images } from '../data/content'

export default function InstagramGrid() {
  return <section className="instagram section" id="instagram"><div className="instagram__heading reveal"><p className="eyebrow">FOLLOW THE MOVEMENT</p><h2>@KREAONE</h2><a className="text-link" href="#instagram">FOLLOW ON INSTAGRAM <span>↗</span></a></div><div className="instagram__grid">{images.instagram.map((src, index) => <img src={src} alt={`Inspiración KREA ONE ${index + 1}, imagen placeholder`} loading="lazy" key={src} />)}</div></section>
}
