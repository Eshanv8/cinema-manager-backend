import React, { useState, useEffect } from 'react';
import merchandiseService from '../services/merchandiseService';
import './MerchandiseShop.css';

const MerchandiseShop = () => {
  const [merchandiseList, setMerchandiseList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  const categories = [
    'ALL',
    'TOYS',
    'ACTION_FIGURES',
    'PLUSHIES',
    'POSTERS',
    'T-SHIRTS',
    'MUGS',
    'COLLECTIBLES'
  ];

  useEffect(() => {
    fetchMerchandise();
    loadCart();
  }, []);

  useEffect(() => {
    filterMerchandise();
  }, [selectedCategory, searchQuery, merchandiseList]);

  const fetchMerchandise = async () => {
    try {
      const data = await merchandiseService.getAllMerchandise();
      console.log('Shop - Fetched merchandise:', data);
      console.log('Shop - First item:', data[0]);
      setMerchandiseList(data);
    } catch (error) {
      console.error('Error fetching merchandise:', error);
    }
  };

  const filterMerchandise = () => {
    let filtered = [...merchandiseList];

    // Filter by category
    if (selectedCategory !== 'ALL') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.characterName && item.characterName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.relatedMovie && item.relatedMovie.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredList(filtered);
  };

  const loadCart = () => {
    const savedCart = localStorage.getItem('merchandiseCart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  };

  const saveCart = (newCart) => {
    localStorage.setItem('merchandiseCart', JSON.stringify(newCart));
    setCart(newCart);
  };

  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    let newCart;

    if (existingItem) {
      if (existingItem.quantity >= item.stock) {
        alert('Cannot add more items than available in stock!');
        return;
      }
      newCart = cart.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );
    } else {
      newCart = [...cart, { ...item, quantity: 1 }];
    }

    saveCart(newCart);
    alert(`${item.name} added to cart!`);
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    const item = merchandiseList.find(m => m.id === itemId);
    if (item && newQuantity > item.stock) {
      alert('Cannot add more items than available in stock!');
      return;
    }

    const newCart = cart.map(cartItem =>
      cartItem.id === itemId
        ? { ...cartItem, quantity: newQuantity }
        : cartItem
    );
    saveCart(newCart);
  };

  const removeFromCart = (itemId) => {
    const newCart = cart.filter(item => item.id !== itemId);
    saveCart(newCart);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    alert('Checkout functionality will be implemented soon!');
    // TODO: Implement checkout with order creation
  };

  return (
    <div className="merchandise-shop">
      <div className="shop-header">
        <h1>Movie Merchandise Store</h1>
        <p>Shop exclusive toys and collectibles from your favorite movies!</p>
      </div>

      <div className="shop-controls">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by name, character, or movie..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="category-filters">
          {categories.map(category => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category.replace('_', ' ')}
            </button>
          ))}
        </div>

        <button className="cart-toggle" onClick={() => setShowCart(!showCart)}>
          🛒 Cart ({cart.length}) - Rs. {getCartTotal().toFixed(2)}
        </button>
      </div>

      {showCart && (
        <div className="cart-panel">
          <div className="cart-header">
            <h2>Shopping Cart</h2>
            <button onClick={() => setShowCart(false)}>✕</button>
          </div>
          {cart.length === 0 ? (
            <p className="empty-cart">Your cart is empty</p>
          ) : (
            <>
              <div className="cart-items">
                {cart.map(item => (
                  <div key={item.id} className="cart-item">
                    <img 
                      src={item.imageUrl || 'https://via.placeholder.com/80x80?text=No+Image'} 
                      alt={item.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                      }}
                    />
                    <div className="cart-item-info">
                      <h4>{item.name}</h4>
                      <p className="item-price">Rs. {item.price.toFixed(2)}</p>
                      <div className="quantity-controls">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                      </div>
                    </div>
                    <div className="cart-item-total">
                      <p>Rs. {(item.price * item.quantity).toFixed(2)}</p>
                      <button 
                        className="remove-btn"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="cart-footer">
                <div className="cart-total">
                  <h3>Total: Rs. {getCartTotal().toFixed(2)}</h3>
                </div>
                <button className="checkout-btn" onClick={handleCheckout}>
                  Proceed to Checkout
                </button>
              </div>
            </>
          )}
        </div>
      )}

      <div className="merchandise-grid">
        {filteredList.length === 0 ? (
          <p className="no-results">No merchandise found matching your criteria.</p>
        ) : (
          filteredList.map(item => (
            <div key={item.id} className="product-card">
              <div className="product-image">
                <img 
                  src={item.imageUrl || 'https://via.placeholder.com/300x300?text=No+Image'} 
                  alt={item.name}
                  onLoad={() => console.log('Shop - Image loaded:', item.name, item.imageUrl)}
                  onError={(e) => {
                    console.error('Shop - Image failed:', item.name, item.imageUrl);
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/300x300?text=Image+Not+Found';
                  }}
                  style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}}
                />
                {item.stock === 0 && <div className="sold-out-badge">SOLD OUT</div>}
                {item.stock > 0 && item.stock < 10 && (
                  <div className="low-stock-badge">Only {item.stock} left!</div>
                )}
              </div>
              <div className="product-info">
                <h3>{item.name}</h3>
                {item.characterName && (
                  <p className="character-tag">
                    <span className="tag-icon">⭐</span> {item.characterName}
                  </p>
                )}
                {item.relatedMovie && (
                  <p className="movie-tag">
                    <span className="tag-icon">🎬</span> {item.relatedMovie}
                  </p>
                )}
                <p className="product-category">{item.category.replace('_', ' ')}</p>
                <p className="product-description">{item.description}</p>
                <div className="product-footer">
                  <span className="product-price">Rs. {item.price.toFixed(2)}</span>
                  <button
                    className="add-to-cart-btn"
                    onClick={() => addToCart(item)}
                    disabled={item.stock === 0}
                  >
                    {item.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MerchandiseShop;
