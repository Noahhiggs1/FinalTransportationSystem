package com.TranzitBooking.Final.model.sql;
import jakarta.persistence.*;
@Entity
@Table(name = "vehicle")
public class Vehicle {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long vehicleId;
    private int capacity;
    @Column(name = "occupied_seats") private int occupiedSeats;
    @Column(name = "available_seats") private int availableSeats;
    @Column(name = "route_id") private Long routeId;
    @Column(name = "employee_id") private Long employeeId;
    public Long getVehicleId() { return vehicleId; }
    public void setVehicleId(Long vehicleId) { this.vehicleId = vehicleId; }
    public int getCapacity() { return capacity; }
    public void setCapacity(int capacity) { this.capacity = capacity; }
    public int getOccupiedSeats() { return occupiedSeats; }
    public void setOccupiedSeats(int occupiedSeats) { this.occupiedSeats = occupiedSeats; }
    public int getAvailableSeats() { return availableSeats; }
    public void setAvailableSeats(int availableSeats) { this.availableSeats = availableSeats; }
    public Long getRouteId() { return routeId; }
    public void setRouteId(Long routeId) { this.routeId = routeId; }
    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }
    }
