package com.TranzitBooking.Final.model.nosql;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;
import java.util.List;
@Document(collection = "delay_events")
public class DelayEvent {
    @Id private String id;
    private String eventId;
    private String type;
    private List<String> affectedLines;
    private String incidentNarrative;
    private Date timestamp;
    private Long employeeId;
    private Long vehicleId;
    private Long routeId;
    private String message;
    private Date createdAt;
    private Date resolvedAt;
    private String severity;
    private Integer estimatedDelayMinutes;
    private String status;
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getEventId() { return eventId; }
    public void setEventId(String eventId) { this.eventId = eventId; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public List<String> getAffectedLines() { return affectedLines; }
    public void setAffectedLines(List<String> affectedLines) { this.affectedLines = affectedLines; }
    public String getIncidentNarrative() { return incidentNarrative; }
    public void setIncidentNarrative(String v) { this.incidentNarrative = v; }
    public Date getTimestamp() { return timestamp; }
    public void setTimestamp(Date timestamp) { this.timestamp = timestamp; }
    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }
    public Long getVehicleId() { return vehicleId; }
    public void setVehicleId(Long vehicleId) { this.vehicleId = vehicleId; }
    public Long getRouteId() { return routeId; }
    public void setRouteId(Long routeId) { this.routeId = routeId; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }
    public Date getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(Date resolvedAt) { this.resolvedAt = resolvedAt; }
    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }
    public Integer getEstimatedDelayMinutes() { return estimatedDelayMinutes; }
    public void setEstimatedDelayMinutes(Integer v) { this.estimatedDelayMinutes = v; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
