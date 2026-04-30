package com.TranzitBooking.Final.repository;

import com.TranzitBooking.Final.model.sql.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByUserId(Long userId);
}