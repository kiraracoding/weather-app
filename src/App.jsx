import { useState } from 'react'
import WeatherData from './WeatherData'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <WeatherData/>
    </>
  )
}

export default App
