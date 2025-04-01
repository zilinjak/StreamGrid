import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [health, setHealth] = useState<string>('')

  useEffect(() => {
    fetch('/health')
      .then(response => response.json())
      .then(data => setHealth(data.status))
      .catch(error => console.error('Error:', error))
  }, [])

  return (
    <div className="app">
      <h1>StreamGrid</h1>
      <p>Backend health status: {health}</p>
    </div>
  )
}

export default App
