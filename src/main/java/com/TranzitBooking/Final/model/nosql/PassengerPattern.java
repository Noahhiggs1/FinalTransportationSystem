package com.TranzitBooking.Final.model.nosql;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Document(collection = "passenger_patterns")
public class PassengerPattern {
    @Id
    private String id;
    private String routeId;
    private String stationOrigin;
    private String stationDestination;
    private String peakHour;
    private int averageVolume;
    private Date lastUpdated;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getRouteId() { return routeId; }
    public void setRouteId(String routeId) { this.routeId = routeId; }
    public String getStationOrigin() { return stationOrigin; }
    public void setStationOrigin(String v) { this.stationOrigin = v; }
    public String getStationDestination() { return stationDestination; }
    public void setStationDestination(String v) { this.stationDestination = v; }
    public String getPeakHour() { return peakHour; }
    public void setPeakHour(String peakHour) { this.peakHour = peakHour; }
    public int getAverageVolume() { return averageVolume; }
    public void setAverageVolume(int averageVolume) { this.averageVolume = averageVolume; }
    public Date getLastUpdated() { return lastUpdated; }
    public void setLastUpdated(Date lastUpdated) { this.lastUpdated = lastUpdated; }
}