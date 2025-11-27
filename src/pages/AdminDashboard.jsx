import React, { useEffect, useState } from 'react';
import movieService from '../services/movieService';
import './AdminDashboard.css';

function AdminDashboard() {
  const [movies, setMovies] = useState([]);
  const [stats, setStats] = useState({ totalMovies: 0, totalBookings: 0, totalRevenue: 0 });
  const [showAddMovie, setShowAddMovie] = useState(false);
  const [newMovie, setNewMovie] = useState({
    title: '',
    description: '',
    genre: '',
    duration: '',
    rating: '',
    releaseDate: '',
    posterUrl: '',
    trailerUrl: '',
    nowShowing: true,
    comingSoon: false
  });

  useEffect(() => {
    loadMovies();
    loadStats();
  }, []);

  const loadMovies = async () => {
    try {
      const response = await movieService.getAllMovies();
      // The service already returns response.data
      setMovies(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Error loading movies:', error);
      setMovies([]);
    }
  };

  const loadStats = () => {
    // Replace with actual API call
    setStats({
      totalMovies: 25,
      totalBookings: 1250,
      totalRevenue: 25000
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewMovie({
      ...newMovie,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleAddMovie = async (e) => {
    e.preventDefault();
    try {
      await movieService.createMovie(newMovie);
      alert('Movie added successfully!');
      setShowAddMovie(false);
      setNewMovie({
        title: '',
        description: '',
        genre: '',
        duration: '',
        rating: '',
        releaseDate: '',
        posterUrl: '',
        trailerUrl: '',
        nowShowing: true,
        comingSoon: false
      });
      loadMovies();
    } catch (error) {
      alert('Error adding movie: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  const handleDeleteMovie = async (id) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      try {
        await movieService.deleteMovie(id);
        alert('Movie deleted successfully!');
        loadMovies();
      } catch (error) {
        alert('Error deleting movie: ' + (error.response?.data?.message || 'Unknown error'));
      }
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-container">
        <h1>🎬 Admin Dashboard</h1>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Movies</h3>
            <p className="stat-value">{stats.totalMovies}</p>
          </div>
          <div className="stat-card">
            <h3>Total Bookings</h3>
            <p className="stat-value">{stats.totalBookings}</p>
          </div>
          <div className="stat-card">
            <h3>Total Revenue</h3>
            <p className="stat-value">${stats.totalRevenue.toLocaleString()}</p>
          </div>
        </div>

        <div className="actions-bar">
          <button className="add-movie-btn" onClick={() => setShowAddMovie(!showAddMovie)}>
            {showAddMovie ? 'Cancel' : '+ Add New Movie'}
          </button>
        </div>

        {showAddMovie && (
          <div className="add-movie-form">
            <h2>Add New Movie</h2>
            <form onSubmit={handleAddMovie}>
              <div className="form-grid">
                <input
                  type="text"
                  name="title"
                  placeholder="Movie Title"
                  value={newMovie.title}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="genre"
                  placeholder="Genre"
                  value={newMovie.genre}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="number"
                  name="duration"
                  placeholder="Duration (minutes)"
                  value={newMovie.duration}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="number"
                  step="0.1"
                  name="rating"
                  placeholder="Rating (0-10)"
                  value={newMovie.rating}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="date"
                  name="releaseDate"
                  value={newMovie.releaseDate}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="url"
                  name="posterUrl"
                  placeholder="Poster URL"
                  value={newMovie.posterUrl}
                  onChange={handleInputChange}
                />
                <input
                  type="url"
                  name="trailerUrl"
                  placeholder="Trailer URL"
                  value={newMovie.trailerUrl}
                  onChange={handleInputChange}
                />
              </div>
              <textarea
                name="description"
                placeholder="Movie Description"
                value={newMovie.description}
                onChange={handleInputChange}
                rows="4"
                required
              />
              <div className="checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="nowShowing"
                    checked={newMovie.nowShowing}
                    onChange={handleInputChange}
                  />
                  Now Showing
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="comingSoon"
                    checked={newMovie.comingSoon}
                    onChange={handleInputChange}
                  />
                  Coming Soon
                </label>
              </div>
              <button type="submit" className="submit-btn">Add Movie</button>
            </form>
          </div>
        )}

        <div className="movies-table">
          <h2>All Movies</h2>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Genre</th>
                <th>Duration</th>
                <th>Rating</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {movies.map(movie => (
                <tr key={movie.id}>
                  <td>{movie.title}</td>
                  <td>{movie.genre}</td>
                  <td>{movie.duration} min</td>
                  <td>⭐ {movie.rating}</td>
                  <td>
                    <span className={`status ${movie.nowShowing ? 'showing' : 'upcoming'}`}>
                      {movie.nowShowing ? 'Now Showing' : 'Coming Soon'}
                    </span>
                  </td>
                  <td>
                    <button className="edit-btn-small">Edit</button>
                    <button className="delete-btn-small" onClick={() => handleDeleteMovie(movie.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
