import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SharedLayout } from './pages/SharedLayout';
import { Pokemon } from './pages/Pokemon';
import { Home } from './pages/Home';
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<SharedLayout/>}>
          <Route index element={<Home/>}/>
          <Route path='/pokemon/:id' element={<Pokemon/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
