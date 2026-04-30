package com.TranzitBooking.Final.model.nosql;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Document(collection = "crowd_logs")
public class CrowdLog {
    @Id
    private String id;
    private String logId;
    private String stationName;
    private int occupancyPercentage;
    private String sensorId;
    private String status;
    private Date timestamp;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getLogId() { return logId; }
    public void setLogId(String logId) { this.logId = logId; }
    public String getStationName() { return stationName; }
    public void setStationName(String stationName) { this.stationName = stationName; }
    public int getOccupancyPercentage() { return occupancyPercentage; }
    public void setOccupancyPercentage(int v) { this.occupancyPercentage = v; }
    public String getSensorId() { return sensorId; }
    public void setSensorId(String sensorId) { this.sensorId = sensorId; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Date getTimestamp() { return timestamp; }
    public void setTimestamp(Date timestamp) { this.timestamp = timestamp; }
}