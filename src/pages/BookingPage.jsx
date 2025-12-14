import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import movieService from '../services/movieService';
import showtimeService from '../services/showtimeService';
import seatService from '../services/seatService';
import bookingService from '../services/bookingService';
import { useAuth } from '../context/AuthContext';
import './BookingPage.css';

function BookingPage() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMovie();
    loadShowtimes();
  }, [movieId]);

  useEffect(() => {
    if (selectedShowtime) {
      loadSeats();
    }
  }, [selectedShowtime]);

  const loadMovie = async () => {
    try {
      const response = await movieService.getMovieById(movieId);
      setMovie(response);
    } catch (error) {
      console.error('Error loading movie:', error);
      setMovie(null);
    } finally {
      setLoading(false);
    }
  };

  const loadShowtimes = async () => {
    try {
      const response = await showtimeService.getShowtimesByMovieId(movieId);
      setShowtimes(response);
    } catch (error) {
      console.error('Error loading showtimes:', error);
      setShowtimes([]);
    }
  };

  const loadSeats = async () => {
    try {
      const response = await seatService.getSeatsByShowtime(selectedShowtime.id);
      setSeats(response);
      setSelectedSeats([]); // Clear selection when changing showtime
    } catch (error) {
      console.error('Error loading seats:', error);
      setSeats([]);
    }
  };

  const toggleSeat = (seat) => {
    if (seat.status !== 'AVAILABLE') {
      return; // Can't select booked seats
    }
    
    const seatId = seat.id;
    if (selectedSeats.find(s => s.id === seatId)) {
      setSelectedSeats(selectedSeats.filter(s => s.id !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const handleBooking = async () => {
    if (!user) {
      alert('Please login to book tickets');
      navigate('/');
      return;
    }

    if (selectedSeats.length === 0) {
      alert('Please select at least one seat');
      return;
    }
    
    if (!selectedShowtime) {
      alert('Please select a showtime');
      return;
    }

    try {
      const totalAmount = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
      const bookingData = {
        userId: user.id,
        movieId: movieId,
        showtimeId: selectedShowtime.id,
        seatIds: selectedSeats.map(s => s.id),
        seatNumbers: selectedSeats.map(s => s.seatNumber),
        numberOfSeats: selectedSeats.length,
        totalAmount: totalAmount,
        showDate: selectedShowtime.showDateTime
      };

      const booking = await bookingService.createBooking(bookingData);
      alert(`Booking confirmed!\nBooking Code: ${booking.bookingCode}\nSeats: ${booking.seatNumbers.join(', ')}\nTotal: $${booking.totalAmount.toFixed(2)}`);
      navigate('/profile');
    } catch (error) {
      console.error('Booking error:', error);
      alert('Error creating booking: ' + (error.response?.data?.message || error.message || 'Some seats may have been booked by another user. Please refresh and try again.'));
      loadSeats(); // Refresh seats to show updated availability
    }
  };

  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  if (!movie) {
    return <div className="loading-container">Movie not found</div>;
  }

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatTime = (timeString) => {
    // Convert 24-hour format to 12-hour format
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  // Group seats by row for display
  const groupedSeats = {};
  seats.forEach(seat => {
    if (!groupedSeats[seat.row]) {
      groupedSeats[seat.row] = [];
    }
    groupedSeats[seat.row].push(seat);
  });

  // Sort rows alphabetically
  const sortedRows = Object.keys(groupedSeats).sort();

  return (
    <div className="booking-page">
      <div className="booking-container">
        <div className="movie-details">
          <img src={movie.posterUrl || 'https://via.placeholder.com/300x450'} alt={movie.title} />
          <div className="movie-info">
            <h1>{movie.title}</h1>
            <p className="genre">{movie.genre}</p>
            <p className="rating">⭐ {movie.imdbRating || movie.rating}/10</p>
            <p className="duration">⏱️ {movie.duration} min</p>
            <p className="description">{movie.description}</p>
          </div>
        </div>

        <div className="showtime-selection">
          <h2>Select Showtime</h2>
          {showtimes.length === 0 ? (
            <p className="no-showtimes">No showtimes available for this movie. Please check back later.</p>
          ) : (
            <div className="showtimes">
              {showtimes.map(showtime => (
                <button
                  key={showtime.id}
                  className={`showtime-btn ${selectedShowtime?.id === showtime.id ? 'selected' : ''}`}
                  onClick={() => setSelectedShowtime(showtime)}
                >
                  <div className="showtime-date">{formatDate(showtime.date)}</div>
                  <div className="showtime-time">{formatTime(showtime.time)}</div>
                  <div className="showtime-format">{showtime.format}</div>
                  <div className="showtime-screen">Screen {showtime.screen}</div>
                  <div className="showtime-price">${showtime.price.toFixed(2)}</div>
                  <div className="seats-available">
                    {showtime.availableSeats > 0 ? 
                      `${showtime.availableSeats} seats available` : 
                      'Sold Out'}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {selectedShowtime && (
          <div className="seat-selection">
            <h2>Select Your Seats</h2>
            <div className="screen">SCREEN</div>
            {seats.length === 0 ? (
              <p>Loading seats...</p>
            ) : (
              <>
                <div className="seats-container">
                  {sortedRows.map(row => (
                    <div key={row} className="seat-row">
                      <span className="row-label">{row}</span>
                      {groupedSeats[row]
                        .sort((a, b) => a.column - b.column)
                        .map(seat => {
                          const isSelected = selectedSeats.find(s => s.id === seat.id);
                          const isBooked = seat.status === 'BOOKED';
                          return (
                            <button
                              key={seat.id}
                              className={`seat ${seat.type.toLowerCase()} ${isSelected ? 'selected' : ''} ${isBooked ? 'booked' : ''}`}
                              onClick={() => toggleSeat(seat)}
                              disabled={isBooked}
                              title={`${seat.seatNumber} - ${seat.type} - $${seat.price.toFixed(2)}`}
                            >
                              {seat.column}
                            </button>
                          );
                        })}
                    </div>
                  ))}
                </div>

                <div className="seat-legend">
                  <div className="legend-item">
                    <span className="seat standard available"></span> Standard
                  </div>
                  <div className="legend-item">
                    <span className="seat premium available"></span> Premium
                  </div>
                  <div className="legend-item">
                    <span className="seat vip available"></span> VIP
                  </div>
                  <div className="legend-item">
                    <span className="seat selected"></span> Selected
                  </div>
                  <div className="legend-item">
                    <span className="seat booked"></span> Booked
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        <div className="booking-summary">
          <h3>Booking Summary</h3>
          <p>Movie: {movie.title}</p>
          {selectedShowtime && (
            <p>Showtime: {formatDateTime(selectedShowtime.showDateTime)}</p>
          )}
          <p>Selected Seats: {selectedSeats.map(s => s.seatNumber).join(', ') || 'None'}</p>
          {selectedSeats.length > 0 && (
            <>
              <p>Seat Details:</p>
              <ul className="seat-details">
                {selectedSeats.map(seat => (
                  <li key={seat.id}>
                    {seat.seatNumber} ({seat.type}) - ${seat.price.toFixed(2)}
                  </li>
                ))}
              </ul>
            </>
          )}
          <p className="total">
            Total: ${selectedSeats.reduce((sum, seat) => sum + seat.price, 0).toFixed(2)}
          </p>
          <button 
            className="confirm-btn" 
            onClick={handleBooking}
            disabled={!selectedShowtime || selectedSeats.length === 0}
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookingPage;
