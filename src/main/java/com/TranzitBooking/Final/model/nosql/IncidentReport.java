package com.TranzitBooking.Final.model.nosql;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;
@Document(collection = "incident_reports")
public class IncidentReport {
    @Id private String id;
    private Long employeeId;
    private Long vehicleId;
    private String title;
    private String description;
    private String severity;
    private String status;
    private Date reportedAt;
    private Date resolvedAt;
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }
    public Long getVehicleId() { return vehicleId; }
    public void setVehicleId(Long vehicleId) { this.vehicleId = vehicleId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Date getReportedAt() { return reportedAt; }
    public void setReportedAt(Date reportedAt) { this.reportedAt = reportedAt; }
    public Date getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(Date resolvedAt) { this.resolvedAt = resolvedAt; }
}
