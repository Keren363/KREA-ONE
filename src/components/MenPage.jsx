import Icon from './Icon'
export default function MenPage() {
  return <main className="men-page">
    <div className="men-page__content">
      <p className="eyebrow">KREA MEN</p>
      <h1>PRÓXIMAMENTE</h1>
      <p className="men-page__copy">Estamos construyendo algo nuevo.</p>
      <div className="men-progress" role="status" aria-label="Colección en proceso">
        <span></span><i></i><i></i><i></i>
      </div>
      <p className="men-page__status">COLECCIÓN EN PROCESO</p>
      <p className="men-page__motto">CREATE. BUILD. BECOME.</p>
      <a className="button" href="/shop">VER COLECCIÓN MUJER <Icon name="arrow-up-right" /></a>
    </div>
  </main>
}
