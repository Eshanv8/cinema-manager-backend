import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './ProfilePage.css';

function ProfilePage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');

  // Sample data (replace with actual API calls)
  useEffect(() => {
    // Load bookings and orders
    setBookings([
      { id: 1, movie: 'Inception', date: '2024-01-15', seats: 'A1, A2', total: 24.00 },
      { id: 2, movie: 'The Matrix', date: '2024-01-10', seats: 'B5', total: 12.00 }
    ]);
    setOrders([
      { id: 1, items: 'Popcorn x2, Cola x1', date: '2024-01-15', total: 15.00 },
      { id: 2, items: 'Nachos x1', date: '2024-01-10', total: 8.00 }
    ]);
  }, []);

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="avatar">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div className="user-info">
            <h1>{user?.username}</h1>
            <p className="email">{user?.email}</p>
            <p className="phone">{user?.phone}</p>
            <div className="loyalty-badge">
              ⭐ {user?.loyaltyPoints} Loyalty Points
            </div>
          </div>
        </div>

        <div className="tabs">
          <button
            className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
          <button
            className={`tab ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            My Bookings
          </button>
          <button
            className={`tab ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            My Orders
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'profile' && (
            <div className="profile-info">
              <h2>Account Information</h2>
              <div className="info-grid">
                <div className="info-item">
                  <label>Username</label>
                  <p>{user?.username}</p>
                </div>
                <div className="info-item">
                  <label>Email</label>
                  <p>{user?.email}</p>
                </div>
                <div className="info-item">
                  <label>Phone</label>
                  <p>{user?.phone}</p>
                </div>
                <div className="info-item">
                  <label>Role</label>
                  <p>{user?.role}</p>
                </div>
                <div className="info-item">
                  <label>Loyalty Points</label>
                  <p className="loyalty-points">{user?.loyaltyPoints} points</p>
                </div>
                <div className="info-item">
                  <label>Member Since</label>
                  <p>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>
              <button className="edit-btn">Edit Profile</button>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="bookings-list">
              <h2>My Bookings</h2>
              {bookings.length > 0 ? (
                bookings.map(booking => (
                  <div key={booking.id} className="booking-card">
                    <div className="booking-info">
                      <h3>{booking.movie}</h3>
                      <p>Date: {booking.date}</p>
                      <p>Seats: {booking.seats}</p>
                    </div>
                    <div className="booking-price">
                      <p className="price">${booking.total}</p>
                      <button className="view-ticket-btn">View Ticket</button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-data">No bookings yet</p>
              )}
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="orders-list">
              <h2>My Orders</h2>
              {orders.length > 0 ? (
                orders.map(order => (
                  <div key={order.id} className="order-card">
                    <div className="order-info">
                      <h3>Order #{order.id}</h3>
                      <p>Items: {order.items}</p>
                      <p>Date: {order.date}</p>
                    </div>
                    <div className="order-price">
                      <p className="price">${order.total}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-data">No orders yet</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
