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
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:3000")
public class BookingController {

    // These repositories let us talk to the database tables
    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    // This inner class is a "DTO" - Data Transfer Object
    // It holds all the information the frontend sends when booking
    // We use this instead of two @RequestBody params which would cause an error
    public static class BookingRequest {
        public Long userId;        // who is buying
        public Long vehicleId;     // which train
        public String seatNumber;  // which seat
        public String paymentMethod; // how they pay
        public Double amount;      // how much
        public LocalDateTime departureTime;
        public LocalDateTime arrivalTime;
    }

    // POST /api/bookings/book
    // This runs when a customer clicks Confirm Booking
    @PostMapping("/book")
    public ResponseEntity<?> bookTicket(@RequestBody BookingRequest request) {

        // Step 1: Check the vehicle still has seats available
        // We do this to prevent double booking
        Optional<Vehicle> vehicleOpt = vehicleRepository.findById(request.vehicleId);
        if (vehicleOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Vehicle not found");
        }

        Vehicle vehicle = vehicleOpt.get();

        if (vehicle.getAvailableSeats() <= 0) {
            return ResponseEntity.badRequest().body("No seats available");
        }

        // Step 2: Create the ticket record
        // This links the user to the vehicle and records their seat
        Ticket ticket = new Ticket();
        ticket.setUserId(request.userId);
        ticket.setVehicleId(request.vehicleId);
        ticket.setSeatNumber(request.seatNumber);
        ticket.setBookingStatus("CONFIRMED");
        ticket.setBookingTimestamp(LocalDateTime.now());
        ticket.setDepartureTime(request.departureTime);
        ticket.setArrivalTime(request.arrivalTime);
        ticket.setTripTimestamp(request.departureTime);

        // Save ticket to database - this gives it a ticketId
        Ticket savedTicket = ticketRepository.save(ticket);

        // Step 3: Create a payment record linked to the ticket
        // This records how much they paid and how
        Payment payment = new Payment();
        payment.setTicketId(savedTicket.getTicketId());
        payment.setMethod(request.paymentMethod != null 
            ? request.paymentMethod : "CARD");
        payment.setAmount(request.amount != null 
            ? request.amount : 0.0);
        payment.setTransactionRef("TXN-" + UUID.randomUUID()
            .toString().substring(0, 8).toUpperCase());
        payment.setStatus("COMPLETED");

        paymentRepository.save(payment);

        // Step 4: Update the vehicle seat count
        // Subtract one from available seats and add one to occupied
        vehicle.setAvailableSeats(vehicle.getAvailableSeats() - 1);
        vehicle.setOccupiedSeats(vehicle.getOccupiedSeats() + 1);
        vehicleRepository.save(vehicle);

        // Step 5: Return the saved ticket to the frontend
        // The frontend uses this to show the confirmation details
        return ResponseEntity.ok(savedTicket);
    }

    // POST /api/bookings/cancel
    // This runs when a customer cancels a ticket
    @PostMapping("/cancel")
    public ResponseEntity<?> cancelTicket(@RequestParam Long ticketId) {

        Optional<Ticket> ticketOpt = ticketRepository.findById(ticketId);
        if (ticketOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Ticket not found");
        }

        Ticket ticket = ticketOpt.get();
        ticket.setBookingStatus("CANCELLED");
        ticketRepository.save(ticket);

        // Give the seat back to the vehicle
        Optional<Vehicle> vehicleOpt = vehicleRepository
            .findById(ticket.getVehicleId());
        if (vehicleOpt.isPresent()) {
            Vehicle vehicle = vehicleOpt.get();
            vehicle.setAvailableSeats(vehicle.getAvailableSeats() + 1);
            vehicle.setOccupiedSeats(vehicle.getOccupiedSeats() - 1);
            vehicleRepository.save(vehicle);
        }

        return ResponseEntity.ok("Ticket cancelled successfully");
    }
}