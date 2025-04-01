import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [health, setHealth] = useState<string>('')
  const [backendHealth, setBackendHealth] = useState<string>('')

  useEffect(() => {
    fetch('/health')
      .then(response => response.json())
      .then(data => setHealth(data.status))
      .catch(error => console.error('Error:', error))
  }, [])

  useEffect(() => {
    fetch('/api/health')
      .then(response => response.json())
      .then(data => setBackendHealth(data.status))
      .catch(error => console.error('Error:', error))
  }, [])

  return (
    <div className="app">
      <h1>StreamGrid</h1>
      <p>NGINX Healthcheck: {health}</p>
      <p>Backend Healthcheck: {backendHealth}</p>
    </div>
  )
}

export default App
