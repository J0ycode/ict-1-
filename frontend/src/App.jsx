import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import EmpView from './components/EmpView'
import AddEmp from './components/AddEmp'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
      <Navbar/>
        <Routes>
          <Route path="/" element={<EmpView/>}/>
          <Route path="/a" element={<AddEmp/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
