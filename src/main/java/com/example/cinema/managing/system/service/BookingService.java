package com.example.cinema.managing.system.service;

import com.example.cinema.managing.system.model.Booking;
import com.example.cinema.managing.system.model.Seat;
import com.example.cinema.managing.system.model.Showtime;
import com.example.cinema.managing.system.repository.BookingRepository;
import com.example.cinema.managing.system.repository.SeatRepository;
import com.example.cinema.managing.system.repository.ShowtimeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private SeatRepository seatRepository;

    @Autowired
    private ShowtimeRepository showtimeRepository;

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public List<Booking> getBookingsByUserId(String userId) {
        return bookingRepository.findByUserIdOrderByBookingDateDesc(userId);
    }

    public Booking getBookingById(String id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
    }

    public Booking getBookingByCode(String bookingCode) {
        return bookingRepository.findByBookingCode(bookingCode)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
    }

    @Transactional
    public Booking createBooking(Booking booking) {
        // Generate unique booking code
        booking.setBookingCode(UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        booking.setBookingDate(LocalDateTime.now());
        booking.setStatus("CONFIRMED");
        
        // Update seats status to BOOKED
        List<Seat> seats = seatRepository.findAllById(booking.getSeatIds());
        for (Seat seat : seats) {
            if (!"AVAILABLE".equals(seat.getStatus())) {
                throw new RuntimeException("Seat " + seat.getSeatNumber() + " is not available");
            }
            seat.setStatus("BOOKED");
            seat.setBookedBy(booking.getUserId());
        }
        
        // Save booking first to get the ID
        Booking savedBooking = bookingRepository.save(booking);
        
        // Update seats with booking ID
        for (Seat seat : seats) {
            seat.setBookingId(savedBooking.getId());
        }
        seatRepository.saveAll(seats);
        
        // Update showtime available seats
        Showtime showtime = showtimeRepository.findById(booking.getShowtimeId())
                .orElseThrow(() -> new RuntimeException("Showtime not found"));
        showtime.setAvailableSeats(showtime.getAvailableSeats() - booking.getNumberOfSeats());
        showtimeRepository.save(showtime);
        
        return savedBooking;
    }

    @Transactional
    public void cancelBooking(String bookingId) {
        Booking booking = getBookingById(bookingId);
        
        if ("CANCELLED".equals(booking.getStatus())) {
            throw new RuntimeException("Booking is already cancelled");
        }
        
        // Release seats
        List<Seat> seats = seatRepository.findByBookingId(bookingId);
        for (Seat seat : seats) {
            seat.setStatus("AVAILABLE");
            seat.setBookedBy(null);
            seat.setBookingId(null);
        }
        seatRepository.saveAll(seats);
        
        // Update showtime available seats
        Showtime showtime = showtimeRepository.findById(booking.getShowtimeId())
                .orElseThrow(() -> new RuntimeException("Showtime not found"));
        showtime.setAvailableSeats(showtime.getAvailableSeats() + booking.getNumberOfSeats());
        showtimeRepository.save(showtime);
        
        // Update booking status
        booking.setStatus("CANCELLED");
        bookingRepository.save(booking);
    }

    public List<Booking> getBookingsByStatus(String status) {
        return bookingRepository.findByStatus(status);
    }

    public List<Booking> getBookingsByDateRange(LocalDateTime start, LocalDateTime end) {
        return bookingRepository.findByBookingDateBetween(start, end);
    }
}
