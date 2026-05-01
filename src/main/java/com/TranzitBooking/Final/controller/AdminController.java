//Noah
package com.TranzitBooking.Final.controller;

import com.TranzitBooking.Final.model.nosql.CrowdLog;
import com.TranzitBooking.Final.model.nosql.DelayEvent;
import com.TranzitBooking.Final.model.nosql.IncidentReport;
import com.TranzitBooking.Final.model.nosql.PassengerPattern;
import com.TranzitBooking.Final.model.sql.Route;
import com.TranzitBooking.Final.model.sql.Vehicle;
import com.TranzitBooking.Final.service.AnalyticsService;
import com.TranzitBooking.Final.service.DelayService;
import com.TranzitBooking.Final.service.RouteService;
import com.TranzitBooking.Final.service.ScheduleService;
import com.TranzitBooking.Final.repository.IncidentReportMongoRepository;
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

    @Autowired
    private AnalyticsService analyticsService;

    @Autowired
    private IncidentReportMongoRepository incidentReportMongoRepository;

    // --- Existing Routes & Vehicles ---

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

    // --- Delay Events + Incident Narratives ---

    @PostMapping("/delays/report")
    public DelayEvent reportDelay(@RequestParam String eventId,
                                  @RequestParam String type,
                                  @RequestParam String severity,
                                  @RequestParam List<String> affectedLines,
                                  @RequestParam int estimatedDelayMinutes,
                                  @RequestParam(required = false, defaultValue = "") String incidentNarrative) {
        return delayService.createDelayEvent(eventId, type, severity, affectedLines, estimatedDelayMinutes, incidentNarrative);
    }

    @GetMapping("/delays/active")
    public List<DelayEvent> getActiveDelays() {
        return delayService.getActiveDelays();
    }

    @GetMapping("/delays/line/{line}")
    public List<DelayEvent> getDelaysByLine(@PathVariable String line) {
        return delayService.getDelaysByLine(line);
    }

    @PutMapping("/delays/resolve/{id}")
    public DelayEvent resolveDelay(@PathVariable String id) {
        return delayService.resolveDelay(id);
    }

    @PutMapping("/incidents/resolve/{id}")
    public IncidentReport resolveIncident(@PathVariable String id) {
        return incidentReportMongoRepository.findById(id).map(inc -> {
            inc.setStatus("RESOLVED");
            inc.setResolvedAt(new java.util.Date());
            return incidentReportMongoRepository.save(inc);
        }).orElseThrow(() -> new RuntimeException("Incident not found: " + id));
    }

    // --- Crowd Density / Check-in Logs ---

    @PostMapping("/crowd/log")
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

    // --- Passenger Travel Pattern Logs ---

    @PostMapping("/patterns/log")
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
