
import './App.css'

import { Route, Routes } from 'react-router-dom'
import WordEditor from './components/WordEditor'

function App() {


  return (
    <>
    <Routes>

      <Route path='/' element={<WordEditor />} />
    </Routes>

    </>
  )
}

export default App
