import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import GameOne from './pages/GameOne';
import GameTwo from './pages/GameTwo';

function App() {
  return (
    <BrowserRouter basename="/memory-game/">
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/game-one' element={<GameOne />} />
        <Route path='/game-two' element={<GameTwo />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
