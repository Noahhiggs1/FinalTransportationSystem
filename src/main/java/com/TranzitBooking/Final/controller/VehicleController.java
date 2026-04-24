package com.TranzitBooking.Final.controller;

import com.TranzitBooking.Final.model.sql.Vehicle;
import com.TranzitBooking.Final.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
@CrossOrigin(origins = "http://localhost:3000")
public class VehicleController {

    @Autowired
    private VehicleRepository VehicleRepository;

    @GetMapping
    public List<Vehicle> getAllVehicles() {
        return VehicleRepository.findAll();
    }

    @GetMapping("/route/{routeId}")
    public List<Vehicle> getVehiclesByRoute(@PathVariable Long routeId) {
        return VehicleRepository.findByRouteId(routeId);
    }
}