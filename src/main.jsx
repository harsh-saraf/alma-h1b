import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AlmaPrototype from './alma_prototype_1.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AlmaPrototype />
  </StrictMode>,
)
