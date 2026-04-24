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

    @PostMapping("/report")
    public DelayEvent reportDelay(@RequestParam String eventId,
                                  @RequestParam String type,
                                  @RequestParam String severity,
                                  @RequestParam List<String> affectedLines,
                                  @RequestParam int estimatedDelayMinutes,
                                  @RequestParam(required = false, defaultValue = "") String incidentNarrative) {
        return delayService.createDelayEvent(eventId, type, severity, affectedLines, estimatedDelayMinutes, incidentNarrative);
    }

    @GetMapping("/active")
    public List<DelayEvent> getActiveDelays() {
        return delayService.getActiveDelays();
    }

    @GetMapping("/line/{line}")
    public List<DelayEvent> getDelaysByLine(@PathVariable String line) {
        return delayService.getDelaysByLine(line);
    }

    @PutMapping("/resolve/{id}")
    public DelayEvent resolveDelay(@PathVariable String id) {
        return delayService.resolveDelay(id);
    }

    @PostMapping("/assess")
    public String assessDelay(@RequestBody DelayEvent event) {
        return delayService.assessDelay(event);
    }
}
