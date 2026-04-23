package com.TranzitBooking.Final.model.sql;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "vehicle")
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long vehicleId;
    private String departure;
    private String destination;
    private int capacity;
    private int occupiedSeats;
    private int availableSeats;
    private String status;
    private LocalDateTime departureTime;

    public Long getVehicleId() { return vehicleId; }
    public void setVehicleId(Long vehicleId) { this.vehicleId = vehicleId; }
    public String getDeparture() { return departure; }
    public void setDeparture(String departure) { this.departure = departure; }
    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }
    public int getCapacity() { return capacity; }
    public void setCapacity(int capacity) { this.capacity = capacity; }
    public int getOccupiedSeats() { return occupiedSeats; }
    public void setOccupiedSeats(int occupiedSeats) { this.occupiedSeats = occupiedSeats; }
    public int getAvailableSeats() { return availableSeats; }
    public void setAvailableSeats(int availableSeats) { this.availableSeats = availableSeats; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getDepartureTime() { return departureTime; }
    public void setDepartureTime(LocalDateTime departureTime) { this.departureTime = departureTime; }
}