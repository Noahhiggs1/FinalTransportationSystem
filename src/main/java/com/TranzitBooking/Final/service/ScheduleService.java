package com.TranzitBooking.Final.service;

import com.TranzitBooking.Final.model.sql.Vehicle;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
public class ScheduleService {

    public String getStatus(Vehicle vehicle) {
        LocalDateTime now = LocalDateTime.now();
        if (vehicle.getDepartureTime() == null) return "No departure scheduled.";
        if (now.isBefore(vehicle.getDepartureTime())) {
            return "Vehicle departs at " + vehicle.getDepartureTime();
        }
        return "Vehicle has already departed.";
    }

    public Vehicle updateDeparture(Vehicle vehicle, LocalDateTime newTime) {
        vehicle.setDepartureTime(newTime);
        return vehicle;
    }
}
