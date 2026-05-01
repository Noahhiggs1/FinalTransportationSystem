package com.TranzitBooking.Final.controller;

import com.TranzitBooking.Final.model.sql.Schedule;
import com.TranzitBooking.Final.repository.ScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/schedules")
@CrossOrigin(origins = "http://localhost:3000")
public class ScheduleController {

    @Autowired
    private ScheduleRepository scheduleRepository;

    // Get all stops for a route
    @GetMapping("/route/{routeId}")
    public List<Schedule> getByRoute(@PathVariable Long routeId) {
        return scheduleRepository.findByRouteIdOrderByStopSequenceAsc(routeId);
    }

    // Get stops for a route filtered by date
    @GetMapping("/route/{routeId}/date")
    public List<Schedule> getByRouteAndDate(
            @PathVariable Long routeId,
            @RequestParam String date) {
        LocalDateTime start = LocalDate.parse(date).atStartOfDay();
        LocalDateTime end = LocalDate.parse(date).atTime(23, 59, 59);
        return scheduleRepository.findByRouteIdAndDepartureTimeBetweenOrderByStopSequenceAsc(
            routeId, start, end
        );
    }
}