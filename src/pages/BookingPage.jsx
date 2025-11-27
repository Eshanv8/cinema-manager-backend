import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import movieService from '../services/movieService';
import './BookingPage.css';

function BookingPage() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showtime, setShowtime] = useState('');
  const [loading, setLoading] = useState(true);

  // Sample showtimes (replace with actual API call)
  const showtimes = ['10:00 AM', '1:00 PM', '4:00 PM', '7:00 PM', '10:00 PM'];

  // Sample seat layout (10x10)
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const seatsPerRow = 10;

  useEffect(() => {
    loadMovie();
  }, [movieId]);

  const loadMovie = async () => {
    try {
      const response = await movieService.getMovieById(movieId);
      // The service already returns response.data
      setMovie(response);
    } catch (error) {
      console.error('Error loading movie:', error);
      setMovie(null);
    } finally {
      setLoading(false);
    }
  };

  const toggleSeat = (seatId) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(id => id !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const handleBooking = () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat');
      return;
    }
    if (!showtime) {
      alert('Please select a showtime');
      return;
    }
    
    // Here you would call the booking API
    alert(`Booking confirmed!\nSeats: ${selectedSeats.join(', ')}\nShowtime: ${showtime}`);
    navigate('/home');
  };

  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  if (!movie) {
    return <div className="loading-container">Movie not found</div>;
  }

  return (
    <div className="booking-page">
      <div className="booking-container">
        <div className="movie-details">
          <img src={movie.posterUrl || 'https://via.placeholder.com/300x450'} alt={movie.title} />
          <div className="movie-info">
            <h1>{movie.title}</h1>
            <p className="genre">{movie.genre}</p>
            <p className="rating">⭐ {movie.rating}/10</p>
            <p className="duration">⏱️ {movie.duration} min</p>
            <p className="description">{movie.description}</p>
          </div>
        </div>

        <div className="showtime-selection">
          <h2>Select Showtime</h2>
          <div className="showtimes">
            {showtimes.map(time => (
              <button
                key={time}
                className={`showtime-btn ${showtime === time ? 'selected' : ''}`}
                onClick={() => setShowtime(time)}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        <div className="seat-selection">
          <h2>Select Your Seats</h2>
          <div className="screen">SCREEN</div>
          <div className="seats-container">
            {rows.map(row => (
              <div key={row} className="seat-row">
                <span className="row-label">{row}</span>
                {Array.from({ length: seatsPerRow }, (_, i) => {
                  const seatId = `${row}${i + 1}`;
                  return (
                    <button
                      key={seatId}
                      className={`seat ${selectedSeats.includes(seatId) ? 'selected' : ''}`}
                      onClick={() => toggleSeat(seatId)}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="seat-legend">
            <div className="legend-item">
              <span className="seat available"></span> Available
            </div>
            <div className="legend-item">
              <span className="seat selected"></span> Selected
            </div>
          </div>
        </div>

        <div className="booking-summary">
          <h3>Booking Summary</h3>
          <p>Selected Seats: {selectedSeats.join(', ') || 'None'}</p>
          <p>Showtime: {showtime || 'Not selected'}</p>
          <p className="total">Total: ${selectedSeats.length * 12.00}</p>
          <button className="confirm-btn" onClick={handleBooking}>
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookingPage;
