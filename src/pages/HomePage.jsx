import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import movieService from '../services/movieService';
import { useAuth } from '../context/AuthContext';
import './HomePage.css';

function HomePage() {
  const [nowShowing, setNowShowing] = useState([]);
  const [comingSoon, setComingSoon] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      const [showing, upcoming] = await Promise.all([
        movieService.getNowShowing(),
        movieService.getComingSoon()
      ]);
      // The service already returns response.data, so we use it directly
      setNowShowing(Array.isArray(showing) ? showing : []);
      setComingSoon(Array.isArray(upcoming) ? upcoming : []);
    } catch (error) {
      console.error('Error loading movies:', error);
      // Set empty arrays on error to prevent undefined
      setNowShowing([]);
      setComingSoon([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-container">Loading movies...</div>;
  }

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Welcome back, {user?.username}! 🎬</h1>
        <p className="loyalty-info">You have {user?.loyaltyPoints} loyalty points</p>
      </div>

      <div className="movies-section">
        <h2>🎥 Now Showing</h2>
        <div className="movies-grid">
          {nowShowing.length > 0 ? (
            nowShowing.map(movie => (
              <div key={movie.id} className="movie-card">
                <img src={movie.posterUrl || 'https://via.placeholder.com/300x450'} alt={movie.title} />
                <div className="movie-info">
                  <h3>{movie.title}</h3>
                  <p className="movie-genre">{movie.genre}</p>
                  <p className="movie-rating">⭐ {movie.rating}/10</p>
                  <p className="movie-duration">⏱️ {movie.duration} min</p>
                  <Link to={`/booking/${movie.id}`} className="book-now-btn">
                    Book Now
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p className="no-movies">No movies currently showing</p>
          )}
        </div>
      </div>

      <div className="movies-section">
        <h2>🔜 Coming Soon</h2>
        <div className="movies-grid">
          {comingSoon.length > 0 ? (
            comingSoon.map(movie => (
              <div key={movie.id} className="movie-card">
                <img src={movie.posterUrl || 'https://via.placeholder.com/300x450'} alt={movie.title} />
                <div className="movie-info">
                  <h3>{movie.title}</h3>
                  <p className="movie-genre">{movie.genre}</p>
                  <p className="movie-release">📅 {new Date(movie.releaseDate).toLocaleDateString()}</p>
                  <button className="notify-btn">Notify Me</button>
                </div>
              </div>
            ))
          ) : (
            <p className="no-movies">No upcoming movies</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
