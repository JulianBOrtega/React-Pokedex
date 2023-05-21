import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SharedLayout } from './pages/SharedLayout';
import { Provider } from 'react-redux';
import { Pokemon } from './pages/Pokemon';
import { Home } from './pages/Home';
import store from './app/store';
import './App.css'

function App() {
  return (
    <Provider store={ store }>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<SharedLayout/>}>
            <Route index element={<Home/>}/>
            <Route path='/pokemon/:id' element={<Pokemon/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}

export default App
