package com.TranzitBooking.Final.controller;

import com.TranzitBooking.Final.model.nosql.CrowdLog;
import com.TranzitBooking.Final.model.nosql.PassengerPattern;
import com.TranzitBooking.Final.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "http://localhost:3000")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @PostMapping("/crowd")
    public CrowdLog logCrowd(@RequestParam String logId,
                             @RequestParam String stationName,
                             @RequestParam String sensorId,
                             @RequestParam int occupancyPercentage) {
        return analyticsService.logCrowd(logId, stationName, sensorId, occupancyPercentage);
    }

    @GetMapping("/crowd/station/{stationName}")
    public List<CrowdLog> getCrowdByStation(@PathVariable String stationName) {
        return analyticsService.getCrowdByStation(stationName);
    }

    @GetMapping("/crowd/status/{status}")
    public List<CrowdLog> getCrowdByStatus(@PathVariable String status) {
        return analyticsService.getCrowdByStatus(status);
    }

    @PostMapping("/patterns")
    public PassengerPattern logPattern(@RequestParam String routeId,
                                       @RequestParam String stationOrigin,
                                       @RequestParam String stationDestination,
                                       @RequestParam String peakHour,
                                       @RequestParam int averageVolume) {
        return analyticsService.buildPattern(routeId, stationOrigin, stationDestination, peakHour, averageVolume);
    }

    @GetMapping("/patterns/route/{routeId}")
    public List<PassengerPattern> getPatternsByRoute(@PathVariable String routeId) {
        return analyticsService.getPatternsByRoute(routeId);
    }

    @GetMapping("/patterns")
    public List<PassengerPattern> getAllPatterns() {
        return analyticsService.getAllPatterns();
    }
}
