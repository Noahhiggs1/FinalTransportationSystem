package com.TranzitBooking.Final.model.sql;

import jakarta.persistence.*;

@Entity
@Table(name = "reports_delay")
public class ReportsDelay {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String delayId;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getDelayId() { return delayId; }
    public void setDelayId(String delayId) { this.delayId = delayId; }
}
