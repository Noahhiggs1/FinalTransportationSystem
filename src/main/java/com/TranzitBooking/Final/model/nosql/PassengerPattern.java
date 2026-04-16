package com.TranzitBooking.Final.model.nosql;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Document(collection = "passenger_patterns")
public class PassengerPattern {
    @Id
    private String id;
    private Long userId;
    private List<Long> frequentRoutes;
    private List<String> peakHours;
    private String preferredPaymentMethod;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public List<Long> getFrequentRoutes() { return frequentRoutes; }
    public void setFrequentRoutes(List<Long> frequentRoutes) { this.frequentRoutes = frequentRoutes; }
    public List<String> getPeakHours() { return peakHours; }
    public void setPeakHours(List<String> peakHours) { this.peakHours = peakHours; }
    public String getPreferredPaymentMethod() { return preferredPaymentMethod; }
    public void setPreferredPaymentMethod(String preferredPaymentMethod) { this.preferredPaymentMethod = preferredPaymentMethod; }
}
