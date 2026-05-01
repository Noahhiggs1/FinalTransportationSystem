package com.TranzitBooking.Final.controller;

import com.TranzitBooking.Final.model.sql.Ticket;
import com.TranzitBooking.Final.model.sql.Payment;
import com.TranzitBooking.Final.model.sql.Vehicle;
import com.TranzitBooking.Final.repository.TicketRepository;
import com.TranzitBooking.Final.repository.PaymentRepository;
import com.TranzitBooking.Final.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:3000")
public class BookingController {

    @Autowired private TicketRepository ticketRepository;
    @Autowired private PaymentRepository paymentRepository;
    @Autowired private VehicleRepository vehicleRepository;

    public static class BookingRequest {
        public Long userId;
        public Long vehicleId;
        public String seatNumber;
        public String paymentMethod;
        public Double amount;
        public LocalDateTime departureTime;
        public LocalDateTime arrivalTime;
    }

    @GetMapping("/booked-seats/{vehicleId}")
    public ResponseEntity<List<String>> getBookedSeats(@PathVariable Long vehicleId) {
        List<Ticket> tickets = ticketRepository.findByVehicleIdAndBookingStatus(vehicleId, "CONFIRMED");
        List<String> seats = tickets.stream().map(Ticket::getSeatNumber).collect(Collectors.toList());
        return ResponseEntity.ok(seats);
    }

    @PostMapping("/book")
    public ResponseEntity<?> bookTicket(@RequestBody BookingRequest request) {
        Optional<Vehicle> vehicleOpt = vehicleRepository.findById(request.vehicleId);
        if (vehicleOpt.isEmpty()) return ResponseEntity.badRequest().body("Vehicle not found");
        Vehicle vehicle = vehicleOpt.get();
        if (vehicle.getAvailableSeats() <= 0) return ResponseEntity.badRequest().body("No seats available");
        List<Ticket> existing = ticketRepository.findByVehicleIdAndBookingStatus(request.vehicleId, "CONFIRMED");
        boolean seatTaken = existing.stream().anyMatch(t -> t.getSeatNumber().equals(request.seatNumber));
        if (seatTaken) return ResponseEntity.badRequest().body("Seat already booked");
        Ticket ticket = new Ticket();
        ticket.setUserId(request.userId);
        ticket.setVehicleId(request.vehicleId);
        ticket.setSeatNumber(request.seatNumber);
        ticket.setBookingStatus("CONFIRMED");
        ticket.setBookingTimestamp(LocalDateTime.now());
        ticket.setDepartureTime(request.departureTime);
        ticket.setArrivalTime(request.arrivalTime);
        ticket.setTripTimestamp(request.departureTime);
        Ticket savedTicket = ticketRepository.save(ticket);
        Payment payment = new Payment();
        payment.setTicketId(savedTicket.getTicketId());
        payment.setMethod(request.paymentMethod != null ? request.paymentMethod : "CARD");
        payment.setAmount(request.amount != null ? request.amount : 0.0);
        payment.setTransactionRef("TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        payment.setStatus("COMPLETED");
        paymentRepository.save(payment);
        vehicle.setAvailableSeats(vehicle.getAvailableSeats() - 1);
        vehicle.setOccupiedSeats(vehicle.getOccupiedSeats() + 1);
        vehicleRepository.save(vehicle);
        return ResponseEntity.ok(savedTicket);
    }

    @PostMapping("/cancel")
    public ResponseEntity<?> cancelTicket(@RequestParam Long ticketId) {
        Optional<Ticket> ticketOpt = ticketRepository.findById(ticketId);
        if (ticketOpt.isEmpty()) return ResponseEntity.badRequest().body("Ticket not found");
        Ticket ticket = ticketOpt.get();
        ticket.setBookingStatus("CANCELLED");
        ticketRepository.save(ticket);
        Optional<Vehicle> vehicleOpt = vehicleRepository.findById(ticket.getVehicleId());
        if (vehicleOpt.isPresent()) {
            Vehicle vehicle = vehicleOpt.get();
            vehicle.setAvailableSeats(vehicle.getAvailableSeats() + 1);
            vehicle.setOccupiedSeats(vehicle.getOccupiedSeats() - 1);
            vehicleRepository.save(vehicle);
        }
        return ResponseEntity.ok("Ticket cancelled successfully");
    }
}
