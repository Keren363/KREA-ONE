import { categories } from '../data/content'
export default function ShopByCategory() { return <section className="category-links section"><p className="eyebrow">COMPRAR POR CATEGORÍA</p><div>{categories.map((category, index) => <a href={`/shop/${category.id}`} key={category.id}><span>0{index + 1}</span>{category.label}<b>↗</b></a>)}</div></section> }
