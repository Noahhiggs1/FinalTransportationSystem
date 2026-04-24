//Noah
package com.TranzitBooking.Final.model.nosql;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;
import java.util.List;

@Document(collection = "delay_events")
public class DelayEvent {
    @Id
    private String id;
    private String eventId;
    private String type;
    private String severity;
    private List<String> affectedLines;
    private int estimatedDelayMinutes;
    private String status;
    private String incidentNarrative;
    private Date timestamp;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getEventId() { return eventId; }
    public void setEventId(String eventId) { this.eventId = eventId; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }
    public List<String> getAffectedLines() { return affectedLines; }
    public void setAffectedLines(List<String> affectedLines) { this.affectedLines = affectedLines; }
    public int getEstimatedDelayMinutes() { return estimatedDelayMinutes; }
    public void setEstimatedDelayMinutes(int v) { this.estimatedDelayMinutes = v; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getIncidentNarrative() { return incidentNarrative; }
    public void setIncidentNarrative(String incidentNarrative) { this.incidentNarrative = incidentNarrative; }
    public Date getTimestamp() { return timestamp; }
    public void setTimestamp(Date timestamp) { this.timestamp = timestamp; }
}
