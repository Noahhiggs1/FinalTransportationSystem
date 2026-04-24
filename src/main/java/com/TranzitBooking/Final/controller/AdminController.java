package com.TranzitBooking.Final.controller;

import com.TranzitBooking.Final.model.sql.Route;
import com.TranzitBooking.Final.model.sql.Vehicle;
import com.TranzitBooking.Final.service.RouteService;
import com.TranzitBooking.Final.service.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    @Autowired
    private RouteService routeService;

    @Autowired
    private ScheduleService scheduleService;

    @PostMapping("/routes/create")
    public Route createRoute(@RequestParam String name, @RequestParam String status) {
        return routeService.createRoute(name, status);
    }

    @GetMapping("/vehicles/status")
    public String getVehicleStatus(@RequestBody Vehicle vehicle) {
        return scheduleService.getStatus(vehicle);
    }

    @PutMapping("/vehicles/departure")
    public Vehicle updateDeparture(@RequestBody Vehicle vehicle,
                                    @RequestParam String newTime) {
        LocalDateTime dt = LocalDateTime.parse(newTime);
        return scheduleService.updateDeparture(vehicle, dt);
    }
}