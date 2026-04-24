package com.TranzitBooking.Final.controller;

import com.TranzitBooking.Final.model.sql.Refund;
import com.TranzitBooking.Final.repository.RefundRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/refunds")
@CrossOrigin(origins = "http://localhost:3000")
public class RefundController {

    @Autowired
    private RefundRepository refundRepository;

    // Get all refunds for a specific user
    @GetMapping("/user/{userId}")
    public List<Refund> getUserRefunds(@PathVariable Long userId) {
        return refundRepository.findByUserId(userId);
    }

    // Submit a new refund request
    @PostMapping("/request")
    public Refund requestRefund(@RequestBody Refund refund) {
        refund.setStatus("PENDING");
        return refundRepository.save(refund);
    }
}