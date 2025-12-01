import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ShowtimeManagement.css';

const ShowtimeManagement = () => {
  const [movies, setMovies] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState('');
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    screen: 1,
    price: 12,
    format: '2D',
    availableSeats: 100
  });

  useEffect(() => {
    loadMovies();
    loadShowtimes();
  }, []);

  const loadMovies = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8081/api/movies', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMovies(response.data);
    } catch (error) {
      console.error('Error loading movies:', error);
    }
  };

  const loadShowtimes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8081/api/showtimes/available', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowtimes(response.data);
    } catch (error) {
      console.error('Error loading showtimes:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedMovie) {
      alert('Please select a movie');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const showtimeData = {
        movieId: selectedMovie,
        date: formData.date,
        time: formData.time,
        screen: parseInt(formData.screen),
        price: parseFloat(formData.price),
        format: formData.format,
        availableSeats: parseInt(formData.availableSeats)
      };

      await axios.post('http://localhost:8081/api/showtimes', showtimeData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Showtime added successfully!');
      setFormData({
        date: '',
        time: '',
        screen: 1,
        price: 12,
        format: '2D',
        availableSeats: 100
      });
      setSelectedMovie('');
      loadShowtimes();
    } catch (error) {
      console.error('Error adding showtime:', error);
      alert('Failed to add showtime: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this showtime?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8081/api/showtimes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Showtime deleted successfully!');
      loadShowtimes();
    } catch (error) {
      console.error('Error deleting showtime:', error);
      alert('Failed to delete showtime');
    }
  };

  return (
    <div className="showtime-management">
      <h2>Showtime Management</h2>
      
      <div className="add-showtime-form">
        <h3>Add New Showtime</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select Movie:</label>
            <select
              value={selectedMovie}
              onChange={(e) => setSelectedMovie(e.target.value)}
              required
            >
              <option value="">-- Select Movie --</option>
              {movies.map(movie => (
                <option key={movie.id} value={movie.id}>
                  {movie.title}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Date:</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="form-group">
              <label>Time:</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({...formData, time: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Screen:</label>
              <select
                value={formData.screen}
                onChange={(e) => setFormData({...formData, screen: e.target.value})}
                required
              >
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>Screen {num}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Format:</label>
              <select
                value={formData.format}
                onChange={(e) => setFormData({...formData, format: e.target.value})}
                required
              >
                <option value="2D">2D</option>
                <option value="3D">3D</option>
                <option value="IMAX">IMAX</option>
                <option value="4DX">4DX</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Price ($):</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label>Available Seats:</label>
              <input
                type="number"
                min="1"
                max="200"
                value={formData.availableSeats}
                onChange={(e) => setFormData({...formData, availableSeats: e.target.value})}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-add">Add Showtime</button>
        </form>
      </div>

      <div className="showtimes-list">
        <h3>Current Showtimes ({showtimes.length})</h3>
        {showtimes.length === 0 ? (
          <p className="no-data">No showtimes available</p>
        ) : (
          <div className="showtimes-grid">
            {showtimes.map(showtime => (
              <div key={showtime.id} className="showtime-card">
                <h4>{showtime.movieTitle}</h4>
                <div className="showtime-details">
                  <p><strong>Date:</strong> {new Date(showtime.date).toLocaleDateString()}</p>
                  <p><strong>Time:</strong> {showtime.time}</p>
                  <p><strong>Screen:</strong> {showtime.screen}</p>
                  <p><strong>Format:</strong> {showtime.format}</p>
                  <p><strong>Price:</strong> ${showtime.price}</p>
                  <p><strong>Available Seats:</strong> {showtime.availableSeats}</p>
                </div>
                <button 
                  onClick={() => handleDelete(showtime.id)}
                  className="btn-delete"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowtimeManagement;
