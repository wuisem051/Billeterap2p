import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Captura errores globales para evitar pantalla en blanco
window.addEventListener('error', (e) => {
  console.error('Global error:', e.error)
})
window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise rejection:', e.reason)
})

const container = document.getElementById('root')

if (!container) {
  console.error('No se encontro el elemento #root en el DOM')
} else {
  createRoot(container).render(
    <StrictMode>
      <App />
    </StrictMode>
  )
}
