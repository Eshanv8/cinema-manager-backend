package com.example.cinema.managing.system.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Booking {
    @Id
    private String id;
    
    private String userId;
    
    private String movieId;
    
    private String showtimeId;
    
    private List<String> seatIds;
    
    private List<String> seatNumbers;
    
    private Integer numberOfSeats;
    
    private Double totalAmount;
    
    private String bookingCode; // unique code for QR
    
    private String qrCodeUrl;
    
    private String status; // PENDING, CONFIRMED, CANCELLED, COMPLETED
    
    private String paymentId;
    
    private Integer loyaltyPointsEarned;
    
    private LocalDateTime bookingDate = LocalDateTime.now();
    
    private LocalDateTime showDate;
    
    private boolean emailSent = false;
}
