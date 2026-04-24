package com.TranzitBooking.Final.controller;

import com.TranzitBooking.Final.model.sql.Ticket;
import com.TranzitBooking.Final.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "http://localhost:3000")
public class TicketController {

    @Autowired
    private TicketRepository ticketRepository;

    // Get all tickets for a specific user - shows purchase history
    @GetMapping("/user/{userId}")
    public List<Ticket> getUserTickets(@PathVariable Long userId) {
        return ticketRepository.findByUserId(userId);
    }
}