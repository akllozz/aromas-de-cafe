import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserProvider from './context/UserProvider';
import { CartProvider } from './context/CartContext';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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
import Ventas from '../src/components/Ventas';

function App() {
  const [isLoginVisible, setLoginVisible] = useState(false);

  const handleOpenLogin = () => {
    setLoginVisible(true);
  };

  const handleCloseLogin = () => {
    setLoginVisible(false);
  };

  return (
    <UserProvider>
      <CartProvider>
        <Router>
          <div className="container">
            <Navbar onLoginClick={handleOpenLogin} />
            <Header />
            {isLoginVisible && (
              <div className="modal" onClick={handleCloseLogin}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <span className="close" onClick={handleCloseLogin}>&times;</span>
                  <Login onClose={handleCloseLogin} />
                </div>
              </div>
            )}
            <main>
              <Routes>
                <Route path="/" element={<ProductList />} />
                <Route path="/register" element={<Register />} />
                <Route path="/cart" element={<Cart onRequestLogin={handleOpenLogin} />} />
                <Route path="/politica-privacidad" element={<PoliticaPrivacidad />} />
                <Route path="/terminos-de-servicio" element={<TerminosDeServicio />} />
                <Route path="/ventas" element={<Ventas />} />
              </Routes>
            </main>
            <Footer onOpenLogin={handleOpenLogin} />
          </div>
        </Router>
      </CartProvider>
    </UserProvider>
  );
}

export default App;