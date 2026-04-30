// ADD THIS FILE TO:
// src/main/java/com/TranzitBooking/Final/controller/AdminAnalyticsController.java

package com.TranzitBooking.Final.controller;

import com.TranzitBooking.Final.model.sql.Payment;
import com.TranzitBooking.Final.model.sql.Refund;
import com.TranzitBooking.Final.model.sql.Ticket;
import com.TranzitBooking.Final.model.sql.Vehicle;
import com.TranzitBooking.Final.model.nosql.CrowdLog;
import com.TranzitBooking.Final.model.nosql.DelayEvent;
import com.TranzitBooking.Final.model.nosql.PassengerPattern;
import com.TranzitBooking.Final.repository.PaymentRepository;
import com.TranzitBooking.Final.repository.RefundRepository;
import com.TranzitBooking.Final.repository.TicketRepository;
import com.TranzitBooking.Final.repository.VehicleRepository;
import com.TranzitBooking.Final.repository.CrowdLogRepository;
import com.TranzitBooking.Final.repository.DelayEventRepository;
import com.TranzitBooking.Final.repository.PassengerPatternRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/analytics")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminAnalyticsController {

    @Autowired private PaymentRepository paymentRepository;
    @Autowired private RefundRepository refundRepository;
    @Autowired private TicketRepository ticketRepository;
    @Autowired private VehicleRepository vehicleRepository;
    @Autowired private CrowdLogRepository crowdLogRepository;
    @Autowired private DelayEventRepository delayEventRepository;
    @Autowired private PassengerPatternRepository passengerPatternRepository;

    // ─── Revenue Summary ───────────────────────────────────────────────────────

    @GetMapping("/revenue/summary")
    public Map<String, Object> getRevenueSummary() {
        List<Payment> all = paymentRepository.findAll();

        double totalRevenue = all.stream()
            .filter(p -> "COMPLETED".equals(p.getStatus()))
            .mapToDouble(p -> p.getAmount() != null ? p.getAmount() : 0)
            .sum();

        double refundedAmount = all.stream()
            .filter(p -> "REFUNDED".equals(p.getStatus()))
            .mapToDouble(p -> p.getAmount() != null ? p.getAmount() : 0)
            .sum();

        Map<String, Double> byMethod = all.stream()
            .filter(p -> "COMPLETED".equals(p.getStatus()))
            .collect(Collectors.groupingBy(
                p -> p.getMethod() != null ? p.getMethod() : "UNKNOWN",
                Collectors.summingDouble(p -> p.getAmount() != null ? p.getAmount() : 0)
            ));

        long completedCount = all.stream().filter(p -> "COMPLETED".equals(p.getStatus())).count();
        long refundedCount  = all.stream().filter(p -> "REFUNDED".equals(p.getStatus())).count();
        long pendingCount   = all.stream().filter(p -> "PENDING".equals(p.getStatus())).count();

        Map<String, Object> summary = new LinkedHashMap<>();
        summary.put("totalRevenue", totalRevenue);
        summary.put("refundedAmount", refundedAmount);
        summary.put("netRevenue", totalRevenue - refundedAmount);
        summary.put("totalTransactions", all.size());
        summary.put("completedCount", completedCount);
        summary.put("refundedCount", refundedCount);
        summary.put("pendingCount", pendingCount);
        summary.put("revenueByMethod", byMethod);
        return summary;
    }

    @GetMapping("/revenue/all-payments")
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    // ─── Refund Overview ───────────────────────────────────────────────────────

    @GetMapping("/refunds/all")
    public List<Refund> getAllRefunds() {
        return refundRepository.findAll();
    }

    @GetMapping("/refunds/pending")
    public List<Refund> getPendingRefunds() {
        return refundRepository.findAll().stream()
            .filter(r -> "PENDING".equals(r.getStatus()))
            .collect(Collectors.toList());
    }

    @PutMapping("/refunds/{refundId}/approve")
    public Refund approveRefund(@PathVariable Long refundId) {
        Refund refund = refundRepository.findById(refundId)
            .orElseThrow(() -> new RuntimeException("Refund not found"));
        refund.setStatus("APPROVED");
        refund.setResolvedAt(java.time.LocalDateTime.now());
        return refundRepository.save(refund);
    }

    @PutMapping("/refunds/{refundId}/reject")
    public Refund rejectRefund(@PathVariable Long refundId) {
        Refund refund = refundRepository.findById(refundId)
            .orElseThrow(() -> new RuntimeException("Refund not found"));
        refund.setStatus("REJECTED");
        refund.setResolvedAt(java.time.LocalDateTime.now());
        return refundRepository.save(refund);
    }

    // ─── Ticket / Booking Overview ─────────────────────────────────────────────

    @GetMapping("/tickets/all")
    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    @GetMapping("/tickets/summary")
    public Map<String, Object> getTicketSummary() {
        List<Ticket> all = ticketRepository.findAll();
        Map<String, Long> byStatus = all.stream()
            .collect(Collectors.groupingBy(
                t -> t.getBookingStatus() != null ? t.getBookingStatus() : "UNKNOWN",
                Collectors.counting()
            ));
        Map<String, Object> summary = new LinkedHashMap<>();
        summary.put("totalTickets", all.size());
        summary.put("byStatus", byStatus);
        return summary;
    }

    // ─── Vehicle Fleet Overview ────────────────────────────────────────────────

    @GetMapping("/fleet/all")
    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    @GetMapping("/fleet/summary")
    public Map<String, Object> getFleetSummary() {
        List<Vehicle> all = vehicleRepository.findAll();
        int totalCapacity = all.stream().mapToInt(Vehicle::getCapacity).sum();
        int totalOccupied = all.stream().mapToInt(Vehicle::getOccupiedSeats).sum();
        double avgOccupancy = totalCapacity > 0
            ? (double) totalOccupied / totalCapacity * 100 : 0;

        Map<String, Object> summary = new LinkedHashMap<>();
        summary.put("totalVehicles", all.size());
        summary.put("totalCapacity", totalCapacity);
        summary.put("totalOccupied", totalOccupied);
        summary.put("avgOccupancyPct", Math.round(avgOccupancy * 10.0) / 10.0);
        return summary;
    }

    // ─── Crowd Density ─────────────────────────────────────────────────────────

    @GetMapping("/crowd/all")
    public List<CrowdLog> getAllCrowdLogs() {
        return crowdLogRepository.findAll();
    }

    @GetMapping("/crowd/summary")
    public Map<String, Object> getCrowdSummary() {
        List<CrowdLog> all = crowdLogRepository.findAll();
        Map<String, Long> byStatus = all.stream()
            .collect(Collectors.groupingBy(
                l -> l.getStatus() != null ? l.getStatus() : "UNKNOWN",
                Collectors.counting()
            ));
        OptionalDouble avgOcc = all.stream()
            .mapToInt(CrowdLog::getOccupancyPercentage).average();
        Map<String, Object> summary = new LinkedHashMap<>();
        summary.put("totalLogs", all.size());
        summary.put("byStatus", byStatus);
        summary.put("avgOccupancyPct", avgOcc.isPresent() ? Math.round(avgOcc.getAsDouble()) : 0);
        return summary;
    }

    // ─── Delay Events ──────────────────────────────────────────────────────────

    @GetMapping("/delays/all")
    public List<DelayEvent> getAllDelays() {
        return delayEventRepository.findAll();
    }

    @GetMapping("/delays/summary")
    public Map<String, Object> getDelaySummary() {
        List<DelayEvent> all = delayEventRepository.findAll();
        Map<String, Long> bySeverity = all.stream()
            .collect(Collectors.groupingBy(
                d -> d.getSeverity() != null ? d.getSeverity() : "UNKNOWN",
                Collectors.counting()
            ));
        Map<String, Long> byStatus = all.stream()
            .collect(Collectors.groupingBy(
                d -> d.getStatus() != null ? d.getStatus() : "UNKNOWN",
                Collectors.counting()
            ));
        OptionalDouble avgDelay = all.stream()
            .mapToInt(DelayEvent::getEstimatedDelayMinutes).average();

        Map<String, Object> summary = new LinkedHashMap<>();
        summary.put("totalEvents", all.size());
        summary.put("bySeverity", bySeverity);
        summary.put("byStatus", byStatus);
        summary.put("avgDelayMinutes", avgDelay.isPresent() ? Math.round(avgDelay.getAsDouble()) : 0);
        return summary;
    }

    // ─── Passenger Patterns ────────────────────────────────────────────────────

    @GetMapping("/patterns/all")
    public List<PassengerPattern> getAllPassengerPatterns() {
        return passengerPatternRepository.findAll();
    }

    // ─── Full Dashboard Snapshot ───────────────────────────────────────────────

    @GetMapping("/dashboard")
    public Map<String, Object> getDashboard() {
        Map<String, Object> dashboard = new LinkedHashMap<>();
        dashboard.put("revenue",  getRevenueSummary());
        dashboard.put("tickets",  getTicketSummary());
        dashboard.put("fleet",    getFleetSummary());
        dashboard.put("crowd",    getCrowdSummary());
        dashboard.put("delays",   getDelaySummary());
        return dashboard;
    }
}
