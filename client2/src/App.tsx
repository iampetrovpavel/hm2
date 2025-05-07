import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ChatInterface } from './components/chat-interface'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ChatInterface />} />
        <Route path="/login" element={<div>Login page coming soon</div>} />
      </Routes>
    </Router>
  )
}

export default App