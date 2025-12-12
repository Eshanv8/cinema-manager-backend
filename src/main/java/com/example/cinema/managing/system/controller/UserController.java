package com.example.cinema.managing.system.controller;

import com.example.cinema.managing.system.model.User;
import com.example.cinema.managing.system.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<?> updateUser(@PathVariable String id, @RequestBody Map<String, String> updates) {
        try {
            User user = userService.getUserById(id);
            
            if (user == null) {
                return ResponseEntity.notFound().build();
            }

            // Update basic information
            if (updates.containsKey("username")) {
                user.setUsername(updates.get("username"));
            }
            if (updates.containsKey("email")) {
                user.setEmail(updates.get("email"));
            }
            if (updates.containsKey("phone")) {
                user.setPhone(updates.get("phone"));
            }

            // Handle password change
            if (updates.containsKey("newPassword") && updates.containsKey("currentPassword")) {
                String currentPassword = updates.get("currentPassword");
                String newPassword = updates.get("newPassword");

                // Verify current password
                if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
                    return ResponseEntity.badRequest().body("Current password is incorrect");
                }

                // Update to new password
                user.setPassword(passwordEncoder.encode(newPassword));
            }

            User updatedUser = userService.updateUser(user);
            
            // Remove password from response
            updatedUser.setPassword(null);
            
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
