package com.TranzitBooking.Final.model.sql;

import jakarta.persistence.*;

@Entity
@Table(name = "route_station")
public class RouteStation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long routeId;
    private Long stationId;
    private int stopSequence;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getRouteId() { return routeId; }
    public void setRouteId(Long routeId) { this.routeId = routeId; }
    public Long getStationId() { return stationId; }
    public void setStationId(Long stationId) { this.stationId = stationId; }
    public int getStopSequence() { return stopSequence; }
    public void setStopSequence(int stopSequence) { this.stopSequence = stopSequence; }
}