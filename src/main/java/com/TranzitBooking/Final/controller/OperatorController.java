package com.TranzitBooking.Final.controller;

import com.TranzitBooking.Final.model.nosql.DelayEvent;
import com.TranzitBooking.Final.model.nosql.IncidentReport;
import com.TranzitBooking.Final.model.sql.Vehicle;
import com.TranzitBooking.Final.model.sql.WorkLog;
import com.TranzitBooking.Final.repository.DelayEventRepository;
import com.TranzitBooking.Final.repository.IncidentReportMongoRepository;
import com.TranzitBooking.Final.repository.VehicleRepository;
import com.TranzitBooking.Final.repository.WorkLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/operator")
@CrossOrigin(origins = "http://localhost:3000")
public class OperatorController {

    @Autowired
    private DelayEventRepository delayEventRepository;

    @Autowired
    private IncidentReportMongoRepository incidentReportMongoRepository;

    @Autowired
    private WorkLogRepository workLogRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @GetMapping("/vehicle/{employeeId}")
    public ResponseEntity<?> getAssignedVehicle(
            @PathVariable Long employeeId) {
        List<Vehicle> vehicles = vehicleRepository
            .findByEmployeeId(employeeId);
        if (vehicles.isEmpty()) return ResponseEntity.ok(null);
        return ResponseEntity.ok(vehicles.get(0));
    }

    @GetMapping("/incidents/{employeeId}")
    public List<IncidentReport> getIncidents(
            @PathVariable Long employeeId) {
        return incidentReportMongoRepository
            .findByEmployeeIdOrderByReportedAtDesc(employeeId);
    }

    @PostMapping("/incidents")
    public ResponseEntity<?> reportIncident(
            @RequestBody IncidentReport report) {
        report.setStatus("OPEN");
        report.setReportedAt(new Date());
        return ResponseEntity.ok(
            incidentReportMongoRepository.save(report)
        );
    }

    @PutMapping("/incidents/{id}/resolve")
    public ResponseEntity<?> resolveIncident(
            @PathVariable String id) {
        return incidentReportMongoRepository.findById(id)
            .map(inc -> {
                inc.setStatus("RESOLVED");
                inc.setResolvedAt(new Date());
                return ResponseEntity.ok(
                    incidentReportMongoRepository.save(inc)
                );
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/delays/{employeeId}")
    public List<DelayEvent> getDelays(
            @PathVariable Long employeeId) {
        return delayEventRepository
            .findByEmployeeIdOrderByCreatedAtDesc(employeeId);
    }

    @GetMapping("/delays/active")
    public List<DelayEvent> getActiveDelays() {
        return delayEventRepository.findByStatus("ACTIVE");
    }

    @PostMapping("/delays")
    public ResponseEntity<?> postDelay(
            @RequestBody DelayEvent delay) {
        delay.setStatus("ACTIVE");
        delay.setCreatedAt(new Date());
        return ResponseEntity.ok(
            delayEventRepository.save(delay)
        );
    }

    @PutMapping("/delays/{id}/resolve")
    public ResponseEntity<?> resolveDelay(
            @PathVariable String id) {
        return delayEventRepository.findById(id)
            .map(d -> {
                d.setStatus("RESOLVED");
                d.setResolvedAt(new Date());
                return ResponseEntity.ok(
                    delayEventRepository.save(d)
                );
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/worklogs/{employeeId}")
    public List<WorkLog> getWorkLogs(
            @PathVariable Long employeeId) {
        return workLogRepository
            .findByEmployeeIdOrderByLogDateDesc(employeeId);
    }

    @PostMapping("/clockin/{employeeId}")
    public ResponseEntity<?> clockIn(
            @PathVariable Long employeeId) {
        Optional<WorkLog> active = workLogRepository
            .findByEmployeeIdAndClockOutIsNull(employeeId);
        if (active.isPresent()) {
            return ResponseEntity.badRequest()
                .body("Already clocked in.");
        }
        WorkLog log = new WorkLog();
        log.setEmployeeId(employeeId);
        log.setClockIn(LocalDateTime.now());
        log.setLogDate(java.time.LocalDate.now());
        return ResponseEntity.ok(workLogRepository.save(log));
    }

    @PostMapping("/clockout/{employeeId}")
    public ResponseEntity<?> clockOut(
            @PathVariable Long employeeId) {
        Optional<WorkLog> active = workLogRepository
            .findByEmployeeIdAndClockOutIsNull(employeeId);
        if (active.isEmpty()) {
            return ResponseEntity.badRequest()
                .body("Not clocked in.");
        }
        WorkLog log = active.get();
        log.setClockOut(LocalDateTime.now());
        Duration d = Duration.between(
            log.getClockIn(), log.getClockOut()
        );
        double hours = d.toMinutes() / 60.0;
        log.setTotalHours(Math.round(hours * 100.0) / 100.0);
        return ResponseEntity.ok(workLogRepository.save(log));
    }

    @GetMapping("/clockstatus/{employeeId}")
    public ResponseEntity<?> getClockStatus(
            @PathVariable Long employeeId) {
        Optional<WorkLog> active = workLogRepository
            .findByEmployeeIdAndClockOutIsNull(employeeId);
        return ResponseEntity.ok(active.isPresent());
    }
}