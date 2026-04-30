package com.TranzitBooking.Final.model.sql;

import jakarta.persistence.*;

@Entity
@Table(name = "payment")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long paymentId;

    // Links this payment to a specific ticket
    // The @Column(unique=true) matches your SQL which has ticket_id as unique
    @Column(unique = true)
    private Long ticketId;

    private String method;          // CARD, CASH, etc
    private Double amount;          // how much was paid
    private String transactionRef;  // unique transaction ID we generate
    private String status;          // COMPLETED, PENDING, REFUNDED

    public Long getPaymentId() { return paymentId; }
    public void setPaymentId(Long paymentId) { this.paymentId = paymentId; }
    public Long getTicketId() { return ticketId; }
    public void setTicketId(Long ticketId) { this.ticketId = ticketId; }
    public String getMethod() { return method; }
    public void setMethod(String method) { this.method = method; }
    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }
    public String getTransactionRef() { return transactionRef; }
    public void setTransactionRef(String transactionRef) { 
        this.transactionRef = transactionRef; 
    }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}