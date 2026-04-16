package com.TranzitBooking.Final.service;

import com.TranzitBooking.Final.model.sql.Payment;
import org.springframework.stereotype.Service;
import java.util.UUID;

@Service
public class PaymentService {

    public Payment processPayment(Long ticketId, String method, Double amount) {
        Payment payment = new Payment();
        payment.setTicketId(ticketId);
        payment.setMethod(method);
        payment.setAmount(amount);
        payment.setTransactionRef(UUID.randomUUID().toString());
        payment.setStatus("COMPLETED");
        return payment;
    }

    public Payment refundPayment(Payment payment) {
        payment.setStatus("REFUNDED");
        return payment;
    }
}
