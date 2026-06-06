import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() =>
    JSON.parse(localStorage.getItem('greenbasket_cart') || '[]')
  );

  const saveCart = (items) => {
    setCartItems(items);
    localStorage.setItem('greenbasket_cart', JSON.stringify(items));
  };

  const addToCart = (product, qty = 1) => {
    const exists = cartItems.find((x) => x._id === product._id);
    const updated = exists
      ? cartItems.map((x) => x._id === product._id ? { ...x, qty: x.qty + qty } : x)
      : [...cartItems, { ...product, qty }];
    saveCart(updated);
  };

  const removeFromCart = (id) => saveCart(cartItems.filter((x) => x._id !== id));

  const updateQty = (id, qty) => {
    if (qty < 1) return removeFromCart(id);
    saveCart(cartItems.map((x) => x._id === id ? { ...x, qty } : x));
  };

  const clearCart = () => saveCart([]);

  const totalItems = cartItems.reduce((acc, x) => acc + x.qty, 0);
  const totalPrice = cartItems.reduce((acc, x) => acc + x.price * x.qty, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQty, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
