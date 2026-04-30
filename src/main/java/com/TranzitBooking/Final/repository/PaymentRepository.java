package com.TranzitBooking.Final.repository;

import com.TranzitBooking.Final.model.sql.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    // Find all payments for a specific ticket
    List<Payment> findByTicketId(Long ticketId);
}