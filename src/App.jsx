
import './App.css'
// import DraftEditor from './components/DraftEditor'
import Editor from './components/Editor'
import QuillEditor from './components/QuillEditor'
import TinyMCEEditor from './components/TinyMCEEditor'
import SlateEditor from './components/SlateEditor'
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
