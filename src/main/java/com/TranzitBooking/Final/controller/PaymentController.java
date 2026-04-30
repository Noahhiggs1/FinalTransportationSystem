package com.TranzitBooking.Final.controller;

import com.TranzitBooking.Final.model.sql.Payment;
import com.TranzitBooking.Final.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:3000")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/process")
    public Payment processPayment(@RequestParam Long ticketId,
                                   @RequestParam String method,
                                   @RequestParam Double amount) {
        return paymentService.processPayment(ticketId, method, amount);
    }

    @PutMapping("/refund")
    public Payment refundPayment(@RequestBody Payment payment) {
        return paymentService.refundPayment(payment);
    }
}