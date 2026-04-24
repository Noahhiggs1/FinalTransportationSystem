package com.TranzitBooking.Final.controller;

import com.TranzitBooking.Final.model.sql.Ticket;
import com.TranzitBooking.Final.model.sql.Vehicle;
import com.TranzitBooking.Final.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:3000")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping("/book")
    public String bookTicket(@RequestBody Ticket ticket, @RequestBody Vehicle vehicle) {
        return bookingService.bookTicket(ticket, vehicle);
    }

    @PostMapping("/cancel")
    public String cancelTicket(@RequestBody Ticket ticket, @RequestBody Vehicle vehicle) {
        return bookingService.cancelTicket(ticket, vehicle);
    }
}