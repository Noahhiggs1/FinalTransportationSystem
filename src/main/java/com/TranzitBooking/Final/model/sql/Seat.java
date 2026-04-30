package com.TranzitBooking.Final.model.sql;
import jakarta.persistence.*;
@Entity
@Table(name = "seat")
public class Seat {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "seat_id") private Long seatId;
    @Column(name = "vehicle_id") private Long vehicleId;
    @Column(name = "seat_number") private String seatNumber;
    @Column(name = "is_available") private boolean isAvailable;
    public Long getSeatId() { return seatId; }
    public void setSeatId(Long seatId) { this.seatId = seatId; }
    public Long getVehicleId() { return vehicleId; }
    public void setVehicleId(Long vehicleId) { this.vehicleId = vehicleId; }
    public String getSeatNumber() { return seatNumber; }
    public void setSeatNumber(String seatNumber) { this.seatNumber = seatNumber; }
    public boolean isAvailable() { return isAvailable; }
    public boolean getIsAvailable() { return isAvailable; }
    public void setAvailable(boolean available) { this.isAvailable = available; }
    public void setIsAvailable(boolean isAvailable) { this.isAvailable = isAvailable; }
}
