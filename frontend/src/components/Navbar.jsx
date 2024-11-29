import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faSignInAlt, faUserPlus, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { UserContext } from '../context/UserProvider';
import { CartContext } from '../context/CartContext';

function Navbar({ onLoginClick }) {
  const { user, setUser } = useContext(UserContext);
  const { cart } = useContext(CartContext);

  const itemCount = cart.reduce((acc, item) => acc + item.cantidad, 0);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <nav className="navbar navbar-expand-lg ">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img className="logo" src="../public/AromasdeCafe_LOGO.png" alt="Aromas de Café Logo" />
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {user ? (
              <>
                <li className="nav-item">
                  <span className="nav-link user-greeting">Hola, {user.nombre}</span>
                </li>
                {user.rol === "admin" && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/ventas">Ventas</Link>
                  </li>
                )}
                {/* <li className="nav-item">
                  <Link className="nav-link" to="/ventas">Ventas</Link>
                </li> */}
                <li className="nav-item">
                  <a className="nav-link" href="#" onClick={handleLogout}>
                    <FontAwesomeIcon icon={faSignOutAlt} /> Cerrar Sesión
                  </a>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    <FontAwesomeIcon icon={faUserPlus} /> Registro
                  </Link>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#" onClick={onLoginClick}>
                    <FontAwesomeIcon icon={faSignInAlt} /> Iniciar Sesión
                  </a>
                </li>
              </>
            )}
            <li className="nav-item d-flex align-items-center">
              <Link className="nav-link position-relative" to="/cart">
                {itemCount > 0 && (
                  <span className="item-count">{itemCount}</span>
                )}
                <FontAwesomeIcon icon={faShoppingCart} /> Carrito
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;