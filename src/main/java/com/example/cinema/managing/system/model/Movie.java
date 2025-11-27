package com.example.cinema.managing.system.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "movies")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Movie {
    @Id
    private String id;
    
    private String title;
    
    private String description;
    
    private Integer duration; // in minutes
    
    private String language;
    
    private String director;
    
    private List<String> cast;
    
    private String genre;
    
    private String rating; // PG, PG-13, R, etc.
    
    private String posterUrl;
    
    private String bannerUrl;
    
    private String trailerUrl;
    
    private LocalDateTime releaseDate;
    
    private Double imdbRating;
    
    private String categoryId;
    
    private Integer viewCount = 0;
    
    private Integer bookingCount = 0;
    
    private boolean featured = false;
    
    private boolean nowShowing = true;
    
    private boolean comingSoon = false;
    
    private LocalDateTime createdAt = LocalDateTime.now();
    
    private LocalDateTime updatedAt = LocalDateTime.now();
}
