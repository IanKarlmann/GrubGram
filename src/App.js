import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home'
import Account from './pages/Account'
import NoPage from './pages/NoPage';

function App() {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route index element= {<Home />} />
        <Route path = "/home" element={<Home />} />
        <Route path = "/account" element={<Account />} />
        <Route path = "*" element={<NoPage />} />
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;
