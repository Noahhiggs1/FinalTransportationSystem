package com.TranzitBooking.Final.controller;

import com.TranzitBooking.Final.model.sql.Ticket;
import com.TranzitBooking.Final.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:3000")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    public static class BookingRequest {
        public Long userId;
        public Long vehicleId;
        public List<String> seatNumbers;
        public String paymentMethod;
        public String paymentToken;
        public Double amount;
    }

    @PostMapping("/book")
    public ResponseEntity<?> bookTicket(@RequestBody BookingRequest request) {
        try {
            if (request.seatNumbers == null || request.seatNumbers.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body("Please select at least one seat");
            }

            if (request.seatNumbers.size() > 6) {
                return ResponseEntity.badRequest()
                    .body("Maximum 6 seats can be booked at one time");
            }

            List<Ticket> tickets = bookingService.bookMultipleSeats(
                request.userId,
                request.vehicleId,
                request.seatNumbers,
                request.paymentMethod,
                request.paymentToken,
                request.amount
            );

            return ResponseEntity.ok(tickets);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/cancel")
    public ResponseEntity<?> cancelTicket(@RequestParam Long ticketId) {
        try {
            String result = bookingService.cancelTicket(ticketId);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}