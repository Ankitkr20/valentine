import { Routes, Route } from "react-router-dom"
import ValentinePage from './Valentine'

function App() {
  return (
    <Routes>
      <Route path="/valentine" element={<ValentinePage />} />
    </Routes>
  )
}

export default App
