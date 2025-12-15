package com.example.cinema.managing.system.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "merchandise")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Merchandise {
    @Id
    private String id;
    
    private String name;
    
    private String description;
    
    private Double price;
    
    private String category; // POSTERS, T-SHIRTS, MUGS, COLLECTIBLES
    
    private String imageUrl;
    
    private Integer stock;
    
    private boolean bundle = false;
    
    private String bundleMovieId;
    
    private Integer salesCount = 0;
    
    private boolean active = true;
    
    private LocalDateTime createdAt = LocalDateTime.now();
}
