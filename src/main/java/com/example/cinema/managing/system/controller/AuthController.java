package com.example.cinema.managing.system.controller;

import com.example.cinema.managing.system.model.User;
import com.example.cinema.managing.system.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000") // Allow React to access
public class AuthController {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    // SIGNUP API
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists");
        }
        user.setRole("USER"); // Default role
        user.setPassword(passwordEncoder.encode(user.getPassword())); // Hash password
        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully");
    }

    // LOGIN API
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        User dbUser = userRepository.findByEmail(user.getEmail()).orElse(null);
        
        // Check password with BCrypt
        if (dbUser != null && passwordEncoder.matches(user.getPassword(), dbUser.getPassword())) {
            return ResponseEntity.ok(dbUser); // Return user info to frontend
        }
        return ResponseEntity.status(401).body("Invalid credentials");
    }
}