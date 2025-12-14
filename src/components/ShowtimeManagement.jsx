import React, { useState, useEffect } from 'react';
import movieService from '../services/movieService';
import showtimeService from '../services/showtimeService';
import './ShowtimeManagement.css';

const ShowtimeManagement = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    screenNumber: '1',
    price: 1500,
    format: '2D',
    availableSeats: 100,
    totalSeats: 100
  });

  useEffect(() => {
    loadMovies();
  }, []);

  useEffect(() => {
    if (selectedMovie) {
      loadShowtimes(selectedMovie.id);
    }
  }, [selectedMovie]);

  const loadMovies = async () => {
    try {
      const response = await movieService.getAllMovies();
      setMovies(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Error loading movies:', error);
      setMovies([]);
    }
  };

  const loadShowtimes = async (movieId) => {
    try {
      const response = await showtimeService.getShowtimesByMovieId(movieId);
      setShowtimes(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Error loading showtimes:', error);
      setShowtimes([]);
    }
  };

  const handleMovieSelect = (movie) => {
    setSelectedMovie(movie);
    setShowAddForm(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedMovie) {
      alert('Please select a movie first');
      return;
    }

    try {
      // Combine date and time into LocalDateTime format
      const showDateTime = `${formData.date}T${formData.time}:00`;
      
      // Create new showtime object
      const newShowtime = {
        movieId: selectedMovie.id,
        screenNumber: formData.screenNumber,
        showDateTime: showDateTime,
        price: parseFloat(formData.price),
        format: formData.format,
        availableSeats: parseInt(formData.availableSeats),
        totalSeats: parseInt(formData.totalSeats),
        active: true
      };

      // Save to backend using showtimeService
      await showtimeService.createShowtime(newShowtime);
      
      alert('Showtime added successfully!');
      
      // Reset form
      setFormData({
        date: '',
        time: '',
        screenNumber: '1',
        price: 1500,
        format: '2D',
        availableSeats: 100,
        totalSeats: 100
      });
      setShowAddForm(false);
      
      // Reload showtimes for this movie
      await loadShowtimes(selectedMovie.id);
      
    } catch (error) {
      console.error('Error adding showtime:', error);
      alert('Failed to add showtime: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDeleteShowtime = async (showtimeId) => {
    if (!window.confirm('Are you sure you want to delete this showtime?')) return;

    try {
      await showtimeService.deleteShowtime(showtimeId);
      
      alert('Showtime deleted successfully!');
      
      // Reload showtimes
      await loadShowtimes(selectedMovie.id);
      
    } catch (error) {
      console.error('Error deleting showtime:', error);
      alert('Failed to delete showtime');
    }
  };

  const formatTime = (showDateTime) => {
    if (!showDateTime) return '';
    const date = new Date(showDateTime);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const formatDate = (showDateTime) => {
    if (!showDateTime) return '';
    const date = new Date(showDateTime);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="showtime-management-container">
      <div className="management-section">
        <h2>📽️ Showtime Management</h2>
        <p className="section-description">Manage movie showtimes - add, edit, or remove screening schedules</p>

        {/* Movie Selection */}
        <div className="movie-selection-section">
          <h3>Select a Movie to Manage Showtimes</h3>
          <div className="movie-grid">
            {movies.filter(m => m.nowShowing).map(movie => (
              <div 
                key={movie.id} 
                className={`movie-card-small ${selectedMovie?.id === movie.id ? 'selected' : ''}`}
                onClick={() => handleMovieSelect(movie)}
              >
                <img src={movie.posterUrl || 'https://via.placeholder.com/100x150'} alt={movie.title} />
                <div className="movie-card-info">
                  <h4>{movie.title}</h4>
                  <p>{movie.genre}</p>
                  <span className="showtime-count">
                    Click to manage showtimes
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Showtime Details */}
        {selectedMovie && (
          <div className="showtime-details-section">
            <div className="section-header">
              <h3>Showtimes for "{selectedMovie.title}"</h3>
              <button 
                className="btn-add-showtime"
                onClick={() => setShowAddForm(!showAddForm)}
              >
                {showAddForm ? '✕ Cancel' : '+ Add Showtime'}
              </button>
            </div>

            {/* Add Showtime Form */}
            {showAddForm && (
              <div className="add-showtime-form">
                <h4>Add New Showtime</h4>
                <form onSubmit={handleSubmit}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Date</label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Time</label>
                      <input
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Screen</label>
                      <select
                        name="screenNumber"
                        value={formData.screenNumber}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="1">Screen 1</option>
                        <option value="2">Screen 2</option>
                        <option value="3">Screen 3</option>
                        <option value="VIP Hall">VIP Hall</option>
                        <option value="IMAX Hall">IMAX Hall</option>
                        <option value="4DX Hall">4DX Hall</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Format</label>
                      <select
                        name="format"
                        value={formData.format}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="2D">2D</option>
                        <option value="3D">3D</option>
                        <option value="IMAX">IMAX</option>
                        <option value="4DX">4DX</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Price (LKR)</label>
                      <input
                        type="number"
                        name="price"
                        step="1"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Total Seats</label>
                      <input
                        type="number"
                        name="totalSeats"
                        value={formData.totalSeats}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn-submit">
                    Add Showtime
                  </button>
                </form>
              </div>
            )}

            {/* Showtime List */}
            <div className="showtimes-list">
              {showtimes.length === 0 ? (
                <div className="empty-state">
                  <p>No showtimes available for this movie</p>
                  <button onClick={() => setShowAddForm(true)}>Add First Showtime</button>
                </div>
              ) : (
                <div className="showtimes-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Format</th>
                        <th>Screen</th>
                        <th>Price</th>
                        <th>Seats</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {showtimes
                        .sort((a, b) => new Date(a.showDateTime) - new Date(b.showDateTime))
                        .map(showtime => (
                        <tr key={showtime.id}>
                          <td>{formatDate(showtime.showDateTime)}</td>
                          <td>{formatTime(showtime.showDateTime)}</td>
                          <td>
                            <span className={`format-badge ${showtime.format.toLowerCase()}`}>
                              {showtime.format}
                            </span>
                          </td>
                          <td>Screen {showtime.screenNumber}</td>
                          <td>Rs. {showtime.price.toFixed(2)}</td>
                          <td>
                            {showtime.availableSeats}/{showtime.totalSeats}
                            <span className={`availability ${showtime.availableSeats === 0 ? 'sold-out' : ''}`}>
                              {showtime.availableSeats === 0 ? ' (Sold Out)' : ''}
                            </span>
                          </td>
                          <td>
                            <button 
                              className="btn-delete"
                              onClick={() => handleDeleteShowtime(showtime.id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {!selectedMovie && (
          <div className="no-selection">
            <div className="empty-icon">🎬</div>
            <h3>Select a Movie</h3>
            <p>Choose a movie from the list above to manage its showtimes</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowtimeManagement;
