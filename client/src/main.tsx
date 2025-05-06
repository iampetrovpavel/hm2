import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from './router'
import './styles/globals.css'
import { StoreProvider } from "@/lib/store"

ReactDOM.createRoot(document.getElementById('root')!).render(
    <StoreProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </StoreProvider>
)