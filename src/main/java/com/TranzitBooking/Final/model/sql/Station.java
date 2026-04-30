package com.TranzitBooking.Final.model.sql;

import jakarta.persistence.*;

@Entity
@Table(name = "station")
public class Station {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long stationId;
    private String stationName;
    private String city;
    private String state;

    public Long getStationId() { return stationId; }
    public void setStationId(Long stationId) { this.stationId = stationId; }
    public String getStationName() { return stationName; }
    public void setStationName(String stationName) { this.stationName = stationName; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
}
