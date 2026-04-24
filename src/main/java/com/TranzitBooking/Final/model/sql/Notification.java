package com.TranzitBooking.Final.model.sql;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notification")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long notificationId;

    private Long userId;
    private String message;

    @Column(name = "is_read")
    private boolean isRead;

    private LocalDateTime createdAt;
    private String notificationType;

    public Long getNotificationId() { return notificationId; }
    public void setNotificationId(Long id) { this.notificationId = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public boolean isRead() { return isRead; }
    public void setRead(boolean read) { this.isRead = read; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public String getNotificationType() { return notificationType; }
    public void setNotificationType(String t) { this.notificationType = t; }
}