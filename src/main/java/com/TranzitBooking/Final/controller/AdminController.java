package com.TranzitBooking.Final.controller;

import com.TranzitBooking.Final.model.sql.Route;
import com.TranzitBooking.Final.model.sql.Vehicle;
import com.TranzitBooking.Final.model.nosql.DelayEvent;
import com.TranzitBooking.Final.service.RouteService;
import com.TranzitBooking.Final.service.ScheduleService;
import com.TranzitBooking.Final.service.DelayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    @Autowired
    private RouteService routeService;

    @Autowired
    private ScheduleService scheduleService;

    @Autowired
    private DelayService delayService;

    @PostMapping("/routes/create")
    public Route createRoute(@RequestParam String name,
                             @RequestParam String status) {
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

    @PostMapping("/delays/create")
    public DelayEvent createDelay(
            @RequestParam Long employeeId,
            @RequestParam Long vehicleId,
            @RequestParam Long routeId,
            @RequestParam String message,
            @RequestParam String severity,
            @RequestParam(required = false) Integer estimatedDelayMinutes) {
        return delayService.createDelayEvent(
            employeeId,
            vehicleId,
            routeId,
            message,
            severity,
            estimatedDelayMinutes
        );
    }

    @GetMapping("/delays/active")
    public List<DelayEvent> getActiveDelays() {
        return delayService.getActiveDelays();
    }

    @GetMapping("/delays/employee/{employeeId}")
    public List<DelayEvent> getDelaysByEmployee(
            @PathVariable Long employeeId) {
        return delayService.getDelaysByEmployee(employeeId);
    }
}