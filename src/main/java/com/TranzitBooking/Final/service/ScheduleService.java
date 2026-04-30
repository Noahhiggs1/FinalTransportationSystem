package com.TranzitBooking.Final.service;

import com.TranzitBooking.Final.model.sql.Vehicle;
import com.TranzitBooking.Final.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class ScheduleService {

    @Autowired
    private VehicleRepository vehicleRepository;

    public String getStatus(Vehicle vehicle) {
        if (vehicle == null) return "Vehicle not found.";
        return "Vehicle #" + vehicle.getVehicleId() +
               " — Available seats: " + vehicle.getAvailableSeats();
    }

    public Vehicle updateDeparture(Vehicle vehicle, LocalDateTime newTime) {
        if (vehicle == null) throw new IllegalArgumentException("Vehicle cannot be null");
        
        Optional<Vehicle> existing = vehicleRepository.findById(vehicle.getVehicleId());
        if (existing.isEmpty()) throw new IllegalArgumentException("Vehicle not found in database");
        
        Vehicle toSave = existing.get();
        return vehicleRepository.save(toSave);
    }
}