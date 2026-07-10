import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './lib/preserve-icons.js'
import './data/initGlobals.js'
import { initAnalytics } from './lib/analytics.js'
import App from './App.jsx'

initAnalytics();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
