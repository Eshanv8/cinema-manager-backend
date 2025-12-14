package com.example.cinema.managing.system.service;

import com.example.cinema.managing.system.model.Showtime;
import com.example.cinema.managing.system.model.Seat;
import com.example.cinema.managing.system.repository.ShowtimeRepository;
import com.example.cinema.managing.system.repository.SeatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class ShowtimeService {

    @Autowired
    private ShowtimeRepository showtimeRepository;

    @Autowired
    private SeatRepository seatRepository;

    public List<Showtime> getAllShowtimes() {
        return showtimeRepository.findAll();
    }

    public Showtime getShowtimeById(String id) {
        return showtimeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Showtime not found"));
    }

    public List<Showtime> getShowtimesByMovieId(String movieId) {
        return showtimeRepository.findByMovieIdAndActiveTrueOrderByShowDateTimeAsc(movieId);
    }

    public List<Showtime> getUpcomingShowtimes() {
        return showtimeRepository.findByShowDateTimeAfterAndActiveTrue(LocalDateTime.now());
    }

    @Transactional
    public Showtime createShowtime(Showtime showtime) {
        showtime.setCreatedAt(LocalDateTime.now());
        showtime.setActive(true);
        showtime.setAvailableSeats(showtime.getTotalSeats());
        
        // Save showtime
        Showtime savedShowtime = showtimeRepository.save(showtime);
        
        // Generate seats for this showtime
        generateSeats(savedShowtime);
        
        return savedShowtime;
    }

    private void generateSeats(Showtime showtime) {
        List<Seat> seats = new ArrayList<>();
        String[] rows = {"A", "B", "C", "D", "E", "F", "G", "H", "I", "J"};
        int seatsPerRow = 10;
        
        for (int i = 0; i < rows.length; i++) {
            for (int j = 1; j <= seatsPerRow; j++) {
                Seat seat = new Seat();
                seat.setShowtimeId(showtime.getId());
                seat.setSeatNumber(String.valueOf(j));
                seat.setRow(rows[i]);
                seat.setColumn(j);
                seat.setStatus("AVAILABLE");
                seat.setType("STANDARD");
                seat.setPrice(showtime.getPrice());
                
                seats.add(seat);
            }
        }
        
        seatRepository.saveAll(seats);
    }

    public Showtime updateShowtime(String id, Showtime showtime) {
        Showtime existingShowtime = getShowtimeById(id);
        
        showtime.setId(id);
        showtime.setCreatedAt(existingShowtime.getCreatedAt());
        showtime.setAvailableSeats(existingShowtime.getAvailableSeats());
        
        return showtimeRepository.save(showtime);
    }

    public void deleteShowtime(String id) {
        Showtime showtime = getShowtimeById(id);
        showtime.setActive(false);
        showtimeRepository.save(showtime);
    }
}
