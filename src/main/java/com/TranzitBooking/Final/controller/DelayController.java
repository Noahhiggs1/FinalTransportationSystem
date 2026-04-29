package com.TranzitBooking.Final.controller;

import com.TranzitBooking.Final.model.nosql.DelayEvent;
import com.TranzitBooking.Final.service.DelayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/delays")
@CrossOrigin(origins = "http://localhost:3000")
public class DelayController {

    @Autowired
    private DelayService delayService;

    @GetMapping("/active")
    public List<DelayEvent> getActiveDelays() {
        return delayService.getActiveDelays();
    }

    @GetMapping("/employee/{employeeId}")
    public List<DelayEvent> getByEmployee(@PathVariable Long employeeId) {
        return delayService.getDelaysByEmployee(employeeId);
    }

    @PostMapping("/report")
    public DelayEvent reportDelay(@RequestBody DelayEvent event) {
        return delayService.createDelayEvent(
            event.getEmployeeId(),
            event.getVehicleId(),
            event.getRouteId(),
            event.getMessage(),
            event.getSeverity(),
            event.getEstimatedDelayMinutes()
        );
    }

    @PutMapping("/{id}/resolve")
    public DelayEvent resolveDelay(@PathVariable String id) {
        return delayService.resolveDelay(id);
    }

    @PostMapping("/assess")
    public String assessDelay(@RequestBody DelayEvent event) {
        return delayService.assessDelay(event);
    }
}