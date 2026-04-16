package com.TranzitBooking.Final.controller;

import com.TranzitBooking.Final.model.sql.Ticket;
import com.TranzitBooking.Final.model.sql.Vehicle;
import com.TranzitBooking.Final.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping("/book")
    public String bookTicket(@RequestParam Long vehicleId,
                             @RequestParam String seatNumber) {
        Ticket ticket = new Ticket();
        ticket.setSeatNumber(seatNumber);
        ticket.setVehicleId(vehicleId);
        Vehicle vehicle = new Vehicle();
        vehicle.setAvailableSeats(10);
        vehicle.setOccupiedSeats(0);
        return bookingService.bookTicket(ticket, vehicle);
    }

    @PostMapping("/cancel")
    public String cancelTicket(@RequestParam String seatNumber) {
        Ticket ticket = new Ticket();
        ticket.setSeatNumber(seatNumber);
        ticket.setBookingStatus("CONFIRMED");
        Vehicle vehicle = new Vehicle();
        vehicle.setOccupiedSeats(5);
        vehicle.setAvailableSeats(5);
        return bookingService.cancelTicket(ticket, vehicle);
    }
}
