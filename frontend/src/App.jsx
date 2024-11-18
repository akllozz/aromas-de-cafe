import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserProvider from './context/UserProvider';
import { CartProvider } from './context/CartContext';

// Importaciones de otros componentes
import Navbar from '../src/components/Navbar';
import ProductList from '../src/components/ProductList';
import Register from '../src/components/Register';
import Cart from '../src/components/Cart';
import Login from '../src/components/Login';
import PoliticaPrivacidad from '../src/components/PoliticaPrivacidad';
import TerminosDeServicio from '../src/components/TerminosDeServicio';
import Header from '../src/components/Header';
import Footer from '../src/components/Footer';

function App() {
  const [isLoginVisible, setLoginVisible] = useState(false); // Estado para controlar la visibilidad del modal

  const handleOpenLogin = () => {
    setLoginVisible(true); // Abre el modal
  };

  const handleCloseLogin = () => {
    setLoginVisible(false); // Cierra el modal
  };

  return (
    <UserProvider>
      <CartProvider>
        <Router>
          <Navbar onLoginClick={handleOpenLogin} /> {/* Pasa la función al Navbar */}
          <Header />
          {isLoginVisible && (
            <div className="modal" onClick={handleCloseLogin}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <span className="close" onClick={handleCloseLogin}>&times;</span>
                <Login onClose={handleCloseLogin} />
              </div>
            </div>
          )}
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cart" element={<Cart onRequestLogin={handleOpenLogin} />} />
            <Route path="/politica-privacidad" element={<PoliticaPrivacidad />} />
            <Route path="/terminos-de-servicio" element={<TerminosDeServicio />} />
          </Routes>
          <Footer />
        </Router>
      </CartProvider>
    </UserProvider>
  );
}

export default App;