import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CartItem } from '../types/CartItem';

function CartPage() {
  const navigate = useNavigate();
  const { cart, removeFromCart } = useCart();

  return (
    <>
      <div className="container mt-4 ">
        <h2>Your Cart</h2>
        <div className="mt-3">
          {cart.length === 0 ? (
            <p>Your Cart is Empty</p>
          ) : (
            <ul className="list-group shadow-lg rounded">
              {cart.map((item: CartItem) => (
                <li
                  key={item.bookID}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  {item.title}: ${item.price.toFixed(2)}
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => removeFromCart(item.bookID)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <h3 className="mt-3">
          Total: $
          {cart.reduce((total, item) => total + item.price, 0).toFixed(2)}
        </h3>
        <div className="mt-3">
          <button className="btn btn-primary" disabled={cart.length === 0}>
            Checkout
          </button>
          <button
            className="btn btn-secondary ms-3"
            onClick={() => navigate('/')}
          >
            Continue Browsing
          </button>
        </div>
      </div>
    </>
  );
}

export default CartPage;
