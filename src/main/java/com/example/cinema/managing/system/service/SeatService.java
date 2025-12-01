package com.example.cinema.managing.system.service;

import com.example.cinema.managing.system.model.Seat;
import com.example.cinema.managing.system.repository.SeatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SeatService {

    @Autowired
    private SeatRepository seatRepository;

    public List<Seat> getSeatsByShowtimeId(String showtimeId) {
        return seatRepository.findByShowtimeId(showtimeId);
    }

    public List<Seat> getAvailableSeats(String showtimeId) {
        return seatRepository.findByShowtimeIdAndStatus(showtimeId, "AVAILABLE");
    }

    public List<Seat> getBookedSeats(String showtimeId) {
        return seatRepository.findByShowtimeIdAndStatus(showtimeId, "BOOKED");
    }

    public Seat getSeatById(String id) {
        return seatRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Seat not found"));
    }
}
