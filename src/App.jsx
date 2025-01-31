
import './App.css'
// import DraftEditor from './components/DraftEditor'
import Editor from './components/Editor'
import { Route, Routes } from 'react-router-dom'
import WordEditor from './components/WordEditor'

function App() {


  return (
    <>
    <Routes>
      <Route path='/word' element={<Editor />} />
      <Route path='/' element={<WordEditor />} />
    </Routes>

    </>
  )
}

export default App
