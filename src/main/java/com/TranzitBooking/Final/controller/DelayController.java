package com.TranzitBooking.Final.controller;

import com.TranzitBooking.Final.model.nosql.DelayEvent;
import com.TranzitBooking.Final.service.DelayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/delays")
public class DelayController {

    @Autowired
    private DelayService delayService;

    @PostMapping("/report")
    public DelayEvent reportDelay(@RequestParam Long routeId,
                                   @RequestParam Long vehicleId,
                                   @RequestParam String cause,
                                   @RequestParam int delayMinutes) {
        return delayService.createDelayEvent(routeId, vehicleId, cause, delayMinutes);
    }

    @PostMapping("/assess")
    public String assessDelay(@RequestBody DelayEvent event) {
        return delayService.assessDelay(event);
    }
}
