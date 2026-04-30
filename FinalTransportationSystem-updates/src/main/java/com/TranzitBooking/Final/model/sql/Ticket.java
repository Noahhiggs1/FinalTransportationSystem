package com.TranzitBooking.Final.model.sql;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ticket")
public class Ticket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long ticketId;
    private String seatNumber;
    private String bookingStatus;
    private LocalDateTime bookingTimestamp;
    private LocalDateTime departureTime;
    private LocalDateTime arrivalTime;
    private LocalDateTime tripTimestamp;
    private Long userId;
    private Long vehicleId;

    public Long getTicketId() { return ticketId; }
    public void setTicketId(Long ticketId) { this.ticketId = ticketId; }
    public String getSeatNumber() { return seatNumber; }
    public void setSeatNumber(String seatNumber) { this.seatNumber = seatNumber; }
    public String getBookingStatus() { return bookingStatus; }
    public void setBookingStatus(String bookingStatus) { this.bookingStatus = bookingStatus; }
    public LocalDateTime getBookingTimestamp() { return bookingTimestamp; }
    public void setBookingTimestamp(LocalDateTime bookingTimestamp) { this.bookingTimestamp = bookingTimestamp; }
    public LocalDateTime getDepartureTime() { return departureTime; }
    public void setDepartureTime(LocalDateTime departureTime) { this.departureTime = departureTime; }
    public LocalDateTime getArrivalTime() { return arrivalTime; }
    public void setArrivalTime(LocalDateTime arrivalTime) { this.arrivalTime = arrivalTime; }
    public LocalDateTime getTripTimestamp() { return tripTimestamp; }
    public void setTripTimestamp(LocalDateTime tripTimestamp) { this.tripTimestamp = tripTimestamp; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public Long getVehicleId() { return vehicleId; }
    public void setVehicleId(Long vehicleId) { this.vehicleId = vehicleId; }
}