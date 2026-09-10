import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles/global.css'
import './styles/fixes.css'
import './styles/drop.css'
import './styles/catalog.css'
import './styles/audit.css'
import './styles/image-fit.css'
import './styles/filters.css'
import './styles/contact.css'
import './styles/sets-and-filters.css'
import './styles/interaction.css'
import './styles/men.css'
import './styles/responsive.css'

createRoot(document.getElementById('root')).render(
  <StrictMode><App /></StrictMode>,
)
