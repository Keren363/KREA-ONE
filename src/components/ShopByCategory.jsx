import { categories } from '../data/content'
import Icon from './Icon'
export default function ShopByCategory() { return <section className="category-links section"><p className="eyebrow">COMPRAR POR CATEGORÍA</p><div>{categories.map((category, index) => <a href={`/shop/${category.id}`} key={category.id}><span>0{index + 1}</span>{category.label}<Icon name="arrow-up-right" /></a>)}</div></section> }
