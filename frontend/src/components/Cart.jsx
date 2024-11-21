import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { UserContext } from '../context/UserProvider';
import '../assets/css/cart.css';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function Cart({ onRequestLogin }) {
    const navigate = useNavigate();
    const { cart, removeFromCart, clearCart } = useContext(CartContext);
    const { user } = useContext(UserContext);
    
    const itemCount = cart.reduce((acc, item) => acc + item.cantidad, 0);

    const saveCartToDatabase = async (direccion) => {
        if (!user) return;

        const response = await fetch('http://localhost:5001/api/cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({
                usuario_id: user.id,
                items: cart.map(item => ({
                    producto_id: item.id,
                    cantidad: item.cantidad,
                    email: user.email,
                    descripcion: item.descripcion,
                    imagen: item.imagen,
                    nombre: item.nombre,
                })),
                direccion: direccion 
            }),
        });

        if (response.ok) {
            const responseData = await response.json();
            console.log('Carrito guardado exitosamente:', responseData);
            return true; 
        } else {
            const errorData = await response.text();
            console.error('Error al guardar el carrito:', errorData);
            return false; 
        }
    };

    const handleCheckout = async () => {
        if (cart.length === 0) {
            alert('Tu carrito está vacío. Agrega productos antes de proceder al pago.');
            return;
        }

        if (!user) {
            const { value: confirmPaymentMethod } = await Swal.fire({
                title: 'Continuar como invitado',
                text: '¿Deseas continuar como invitado? Puedes pulsar "Continuar" para seguir o "Inicio de sesión" para registrarte.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Continuar',
                cancelButtonText: 'Inicio de sesión'
            });

            if (confirmPaymentMethod) {
                // Solicitar datos de dirección
                const { value: formValues } = await Swal.fire({
                    title: 'Datos de Envío',
                    html: `
                        <input id="nombre" class="swal2-input" placeholder="Nombre Completo">
                        <input id="correo" class="swal2-input" placeholder="Correo Electrónico">
                        <input id="telefono" class="swal2-input" placeholder="Teléfono">
                        <input id="calle" class="swal2-input" placeholder="Calle">
                        <input id="numero" class="swal2-input" placeholder="Número">
                        <input id="ciudad" class="swal2-input" placeholder="Ciudad">
                    `,
                    focusConfirm: false,
                    preConfirm: () => {
                        return {
                            nombre: document.getElementById('nombre').value,
                            correo: document.getElementById('correo').value,
                            telefono: document.getElementById('telefono').value,
                            calle: document.getElementById('calle').value,
                            numero: document.getElementById('numero').value,
                            ciudad: document.getElementById('ciudad').value,
                        };
                    }
                });

                if (formValues) {
                    
                    const saved = await saveCartToDatabase(formValues);
                    if (saved) {
                        Swal.fire(
                            '¡Éxito!',
                            'Productos pagados satisfactoriamente! Estamos preparando su pedido para que llegue lo más pronto posible.',
                            'success'
                        );
                        clearCart(); 
                    }
                }
            } else {
                const loggedInUser = await onRequestLogin();
                if (loggedInUser) {
                    const saved = await saveCartToDatabase();
                    if (saved) {
                        Swal.fire(
                            '¡Éxito!',
                            'Productos pagados satisfactoriamente! Estamos preparando su pedido para que llegue lo más pronto posible.',
                            'success'
                        );
                        clearCart(); 
                    }
                }
            }
        } else {
            const saved = await saveCartToDatabase();
            if (saved) {
                Swal.fire(
                    '¡Éxito!',
                    'Productos pagados satisfactoriamente! Estamos preparando su pedido para que llegue lo más pronto posible.',
                    'success'
                );
                clearCart();
            }
        }
    };

    return (
        <div className="container">
            <h2>Carrito</h2>
            <div className="cart-icon">
                <span role="img" aria-label="carrito">🛒</span>
                {itemCount > 0 && <span className="item-count">{itemCount}</span>}
            </div>
            {cart.length === 0 ? (
                <p>No tienes productos en tu carrito.</p>
            ) : (
                <div>
                    <div className="row">
                        {cart.map(item => (
                            <div className="col-md-4" key={item.id}>
                                <div className="card mb-4">
                                    <img src={item.imagen} alt={`Café: ${item.nombre}`} className="card-img-top" />
                                    <div className="card-body">
                                        <h5 className="card-title">Café: {item.nombre}</h5>
                                        <p className="card-text">Cantidad: {item.cantidad}</p>
                                        <p className="card-text">Precio: ${item.precio}</p>
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => removeFromCart(item.id)}
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button
                        className="btn btn-primary"
                        onClick={handleCheckout}
                    >
                        Pagar
                    </button>
                </div>
            )}
        </div>
    );
}

export default Cart;
