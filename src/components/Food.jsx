import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import foodService from '../services/foodService';
import bookingService from '../services/bookingService';
import { useAuth } from '../context/AuthContext';
import './Food.css';

const Food = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const { movie, showtime, selectedSeats, ticketQuantity, showtimeId } = location.state || {};
  
  const [foodItems, setFoodItems] = useState([]);
  const [selectedFoods, setSelectedFoods] = useState({});
  const [loading, setLoading] = useState(true);
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const [activeCategory, setActiveCategory] = useState('ALL');

  useEffect(() => {
    if (!movie || !showtime || !selectedSeats || !ticketQuantity) {
      alert('Invalid booking session. Please start from movie details.');
      navigate('/movies');
      return;
    }
    loadFoodItems();
  }, []);

  const loadFoodItems = async () => {
    try {
      setLoading(true);
      const data = await foodService.getAllFoods();
      setFoodItems(data);
    } catch (error) {
      console.error('Error loading food items:', error);
      alert('Failed to load food items');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (foodId, change) => {
    setSelectedFoods(prev => {
      const currentQty = prev[foodId]?.quantity || 0;
      const newQty = Math.max(0, currentQty + change);
      
      if (newQty === 0) {
        const { [foodId]: removed, ...rest } = prev;
        return rest;
      }
      
      const food = foodItems.find(f => f.id === foodId);
      return {
        ...prev,
        [foodId]: {
          ...food,
          quantity: newQty,
          subtotal: food.price * newQty
        }
      };
    });
  };

  const calculateFoodTotal = () => {
    return Object.values(selectedFoods).reduce((sum, item) => sum + item.subtotal, 0);
  };

  const calculateTicketTotal = () => {
    return selectedSeats.length * showtime.price;
  };

  const calculateGrandTotal = () => {
    return calculateTicketTotal() + calculateFoodTotal();
  };

  const handleConfirmBooking = async () => {
    try {
      setBookingInProgress(true);
      
      const foodItemsList = Object.values(selectedFoods).map(item => ({
        foodItemId: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.subtotal
      }));

      const bookingData = {
        userId: user.id,
        movieId: movie.id,
        showtimeId: showtimeId,
        seatIds: selectedSeats.map(seat => seat.id),
        seatNumbers: selectedSeats.map(seat => `${seat.row}${seat.column}`),
        numberOfSeats: selectedSeats.length,
        totalAmount: calculateGrandTotal(),
        foodItems: foodItemsList,
        foodTotal: calculateFoodTotal(),
        showDate: new Date(showtime.showDateTime)
      };

      const response = await bookingService.createBooking(bookingData);
      
      alert(`Booking confirmed!\n\nBooking Code: ${response.bookingCode}\nSeats: ${bookingData.seatNumbers.join(', ')}\nTotal: $${calculateGrandTotal().toFixed(2)}`);
      navigate('/profile');
    } catch (error) {
      console.error('Error creating booking:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create booking';
      alert(`Booking failed: ${errorMessage}`);
    } finally {
      setBookingInProgress(false);
    }
  };

  const handleSkipFood = async () => {
    try {
      setBookingInProgress(true);
      
      const bookingData = {
        userId: user.id,
        movieId: movie.id,
        showtimeId: showtimeId,
        seatIds: selectedSeats.map(seat => seat.id),
        seatNumbers: selectedSeats.map(seat => `${seat.row}${seat.column}`),
        numberOfSeats: selectedSeats.length,
        totalAmount: calculateTicketTotal(),
        foodItems: [],
        foodTotal: 0,
        showDate: new Date(showtime.showDateTime)
      };

      const response = await bookingService.createBooking(bookingData);
      
      alert(`Booking confirmed!\n\nBooking Code: ${response.bookingCode}\nSeats: ${bookingData.seatNumbers.join(', ')}\nTotal: $${calculateTicketTotal().toFixed(2)}`);
      navigate('/profile');
    } catch (error) {
      console.error('Error creating booking:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create booking';
      alert(`Booking failed: ${errorMessage}`);
    } finally {
      setBookingInProgress(false);
    }
  };

  const categories = ['ALL', 'POPCORN', 'DRINKS', 'SNACKS', 'COMBOS'];
  
  const filteredFoodItems = activeCategory === 'ALL' 
    ? foodItems 
    : foodItems.filter(item => item.category === activeCategory);

  if (loading) {
    return <div className="loading-container">Loading food items...</div>;
  }

  return (
    <div className="food-selection-page">
      <div className="food-container">
        <div className="food-header">
          <h1>Add Food & Beverages</h1>
          <p className="food-subtitle">Enhance your movie experience</p>
        </div>

        {/* Order Summary */}
        <div className="order-summary-card">
          <h3>📽️ {movie?.title}</h3>
          <p>🎬 {new Date(showtime?.showDateTime).toLocaleString()}</p>
          <p>🎫 Seats: {selectedSeats?.map(s => `${s.row}${s.column}`).join(', ')}</p>
          <p>💵 Ticket Total: ${calculateTicketTotal().toFixed(2)}</p>
        </div>

        {/* Category Filter */}
        <div className="category-filter">
          {categories.map(category => (
            <button
              key={category}
              className={`category-btn ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Food Items Grid */}
        <div className="food-grid">
          {filteredFoodItems.map(food => {
            const selectedQty = selectedFoods[food.id]?.quantity || 0;
            
            return (
              <div key={food.id} className="food-card">
                <div className="food-image">
                  {food.imageUrl ? (
                    <img src={food.imageUrl} alt={food.name} />
                  ) : (
                    <div className="food-placeholder">
                      {food.category === 'POPCORN' && '🍿'}
                      {food.category === 'DRINKS' && '🥤'}
                      {food.category === 'SNACKS' && '🍫'}
                      {food.category === 'COMBOS' && '🎁'}
                    </div>
                  )}
                  {food.category && (
                    <span className="food-badge">{food.category}</span>
                  )}
                </div>
                <div className="food-info">
                  <h3>{food.name}</h3>
                  <p className="food-description">{food.description}</p>
                  <div className="food-price-row">
                    <span className="food-price">${food.price.toFixed(2)}</span>
                    {selectedQty === 0 ? (
                      <button 
                        className="add-btn"
                        onClick={() => handleQuantityChange(food.id, 1)}
                      >
                        ADD
                      </button>
                    ) : (
                      <div className="quantity-controls">
                        <button onClick={() => handleQuantityChange(food.id, -1)}>−</button>
                        <span>{selectedQty}</span>
                        <button onClick={() => handleQuantityChange(food.id, 1)}>+</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Cart Summary */}
        {Object.keys(selectedFoods).length > 0 && (
          <div className="cart-summary">
            <h3>Your Food Order</h3>
            {Object.values(selectedFoods).map(item => (
              <div key={item.id} className="cart-item">
                <span>{item.name} x {item.quantity}</span>
                <span>${item.subtotal.toFixed(2)}</span>
              </div>
            ))}
            <div className="cart-total">
              <span>Food Total:</span>
              <span>${calculateFoodTotal().toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="food-actions">
          <div className="total-section">
            <div className="total-breakdown">
              <div className="total-row">
                <span>Tickets:</span>
                <span>${calculateTicketTotal().toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Food:</span>
                <span>${calculateFoodTotal().toFixed(2)}</span>
              </div>
              <div className="total-row grand-total">
                <span>Grand Total:</span>
                <span>${calculateGrandTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div className="action-buttons">
            <button 
              className="skip-btn"
              onClick={handleSkipFood}
              disabled={bookingInProgress}
            >
              Skip & Book
            </button>
            <button 
              className="confirm-btn"
              onClick={handleConfirmBooking}
              disabled={bookingInProgress || Object.keys(selectedFoods).length === 0}
            >
              {bookingInProgress ? 'Processing...' : 'Confirm Booking'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Food;
