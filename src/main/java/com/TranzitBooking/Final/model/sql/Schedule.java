package com.TranzitBooking.Final.model.sql;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "schedule")
public class Schedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long scheduleId;

    private Long routeId;
    private Long stationId;
    private int stopSequence;
    private LocalDateTime arrivalTime;
    private LocalDateTime departureTime;

    public Long getScheduleId() { return scheduleId; }
    public Long getRouteId() { return routeId; }
    public void setRouteId(Long routeId) { this.routeId = routeId; }
    public Long getStationId() { return stationId; }
    public void setStationId(Long stationId) { this.stationId = stationId; }
    public int getStopSequence() { return stopSequence; }
    public void setStopSequence(int stopSequence) { this.stopSequence = stopSequence; }
    public LocalDateTime getArrivalTime() { return arrivalTime; }
    public void setArrivalTime(LocalDateTime arrivalTime) { this.arrivalTime = arrivalTime; }
    public LocalDateTime getDepartureTime() { return departureTime; }
    public void setDepartureTime(LocalDateTime departureTime) { this.departureTime = departureTime; }
}