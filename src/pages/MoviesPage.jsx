import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import movieService from '../services/movieService';
import './MoviesPage.css';

function MoviesPage() {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [loading, setLoading] = useState(true);

  const genres = ['All', 'Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance', 'Thriller', 'Animation'];

  useEffect(() => {
    loadMovies();
  }, []);

  useEffect(() => {
    filterMovies();
  }, [searchTerm, selectedGenre, movies]);

  const loadMovies = async () => {
    try {
      const response = await movieService.getAllMovies();
      // The service already returns response.data
      const movieData = Array.isArray(response) ? response : [];
      setMovies(movieData);
      setFilteredMovies(movieData);
    } catch (error) {
      console.error('Error loading movies:', error);
      setMovies([]);
      setFilteredMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const filterMovies = () => {
    let filtered = movies;

    if (searchTerm) {
      filtered = filtered.filter(movie =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedGenre !== 'All') {
      filtered = filtered.filter(movie => movie.genre === selectedGenre);
    }

    setFilteredMovies(filtered);
  };

  if (loading) {
    return <div className="loading-container">Loading movies...</div>;
  }

  return (
    <div className="movies-page">
      <div className="movies-header">
        <h1>🎬 All Movies</h1>
        <div className="filters">
          <input
            type="text"
            placeholder="Search movies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <div className="genre-filters">
            {genres.map(genre => (
              <button
                key={genre}
                className={`genre-btn ${selectedGenre === genre ? 'active' : ''}`}
                onClick={() => setSelectedGenre(genre)}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="movies-grid">
        {filteredMovies.map(movie => (
          <div key={movie.id} className="movie-card">
            <img src={movie.posterUrl || 'https://via.placeholder.com/300x450'} alt={movie.title} />
            <div className="movie-info">
              <h3>{movie.title}</h3>
              <p className="movie-genre">{movie.genre}</p>
              <p className="movie-rating">⭐ {movie.rating}/10</p>
              <p className="movie-duration">⏱️ {movie.duration} min</p>
              <p className="movie-description">{movie.description?.substring(0, 100)}...</p>
              {movie.nowShowing ? (
                <Link to={`/booking/${movie.id}`} className="book-btn">
                  Book Now
                </Link>
              ) : (
                <button className="coming-soon-btn" disabled>Coming Soon</button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredMovies.length === 0 && (
        <div className="no-movies">
          <p>No movies found matching your criteria</p>
        </div>
      )}
    </div>
  );
}

export default MoviesPage;
