import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext' // <-- Import
import "leaflet/dist/leaflet.css";
// 1. Import Bootstrap's CSS
import 'bootstrap/dist/css/bootstrap.min.css';

// 2. Your custom global styles
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  
    <BrowserRouter>
      <ThemeProvider> {/* <-- Wrap App */}
        <App />
      </ThemeProvider>
    </BrowserRouter>
  
)