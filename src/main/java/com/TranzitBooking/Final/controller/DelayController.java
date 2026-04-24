package com.TranzitBooking.Final.controller;

import com.TranzitBooking.Final.model.nosql.DelayEvent;
import com.TranzitBooking.Final.service.DelayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/delays")
@CrossOrigin(origins = "http://localhost:3000")
public class DelayController {

    @Autowired
    private DelayService delayService;

    @PostMapping("/assess")
    public String assessDelay(@RequestBody DelayEvent event) {
        return delayService.assessDelay(event);
    }
}
