package com.TranzitBooking.Final.controller;

import com.TranzitBooking.Final.model.sql.Notification;
import com.TranzitBooking.Final.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:3000")
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;

    // Get all notifications for a specific user
    @GetMapping("/user/{userId}")
    public List<Notification> getUserNotifications(@PathVariable Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    // Mark a notification as read
    @PutMapping("/{id}/read")
    public Notification markAsRead(@PathVariable Long id) {
        Notification n = notificationRepository.findById(id).orElse(null);
        if (n != null) {
            n.setRead(true);
            return notificationRepository.save(n);
        }
        return null;
    }
}
