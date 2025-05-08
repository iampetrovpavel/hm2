import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ChatInterface } from './components/chat-interface'
import { RequestPage } from './components/request-page'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ChatInterface />} />
        <Route path="/login" element={<div>Login page coming soon</div>} />
        <Route path="/request" element={<RequestPage />} />
      </Routes>
    </Router>
  )
}

export default App