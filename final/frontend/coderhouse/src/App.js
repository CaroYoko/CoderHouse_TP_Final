import './App.css';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'

import Cart from './Pages/Carts/Carts.js';
import Product from './Pages/Products/Products.js';
import Register from './Pages/Register/Register.js';
import Login from './Pages/Login/Login.js';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/carts' element={<Cart />} />
        <Route path='/products' element={<Product />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='*' element={<Navigate to='/login'/>} />
      </Routes>
    </BrowserRouter>

  );
}

export default App;
