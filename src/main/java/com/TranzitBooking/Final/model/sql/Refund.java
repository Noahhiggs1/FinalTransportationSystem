package com.TranzitBooking.Final.model.sql;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "refund")
public class Refund {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long refundId;

    private Long ticketId;
    private Long userId;
    private String reason;
    private String status;
    private LocalDateTime requestedAt;
    private LocalDateTime resolvedAt;

    public Long getRefundId() { return refundId; }
    public void setRefundId(Long id) { this.refundId = id; }
    public Long getTicketId() { return ticketId; }
    public void setTicketId(Long ticketId) { this.ticketId = ticketId; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getRequestedAt() { return requestedAt; }
    public void setRequestedAt(LocalDateTime t) { this.requestedAt = t; }
    public LocalDateTime getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(LocalDateTime t) { this.resolvedAt = t; }
}