package com.TranzitBooking.Final.service;

import com.TranzitBooking.Final.model.nosql.DelayEvent;
import com.TranzitBooking.Final.repository.DelayEventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Date;
import java.util.List;

@Service
public class DelayService {

    @Autowired
    private DelayEventRepository delayEventRepository;

    public DelayEvent createDelayEvent(Long employeeId,
                                        Long vehicleId,
                                        Long routeId,
                                        String message,
                                        String severity,
                                        Integer estimatedDelayMinutes) {
        DelayEvent event = new DelayEvent();
        event.setEmployeeId(employeeId);
        event.setVehicleId(vehicleId);
        event.setRouteId(routeId);
        event.setMessage(message);
        event.setSeverity(severity);
        event.setEstimatedDelayMinutes(estimatedDelayMinutes);
        event.setStatus("ACTIVE");
        event.setCreatedAt(new Date());
        return delayEventRepository.save(event);
    }

    public String assessDelay(DelayEvent event) {
        if (event == null) return "No delay event provided.";
        if ("HIGH".equals(event.getSeverity())) {
            return "High severity delay. Immediate action required.";
        } else if ("MEDIUM".equals(event.getSeverity())) {
            return "Medium severity delay. Monitor situation.";
        }
        return "Low severity delay. Informational only.";
    }

    public List<DelayEvent> getActiveDelays() {
        return delayEventRepository.findByStatus("ACTIVE");
    }

    public List<DelayEvent> getDelaysByEmployee(Long employeeId) {
        return delayEventRepository
            .findByEmployeeIdOrderByCreatedAtDesc(employeeId);
    }

    public DelayEvent resolveDelay(String id) {
        return delayEventRepository.findById(id)
            .map(d -> {
                d.setStatus("RESOLVED");
                d.setResolvedAt(new Date());
                return delayEventRepository.save(d);
            })
            .orElseThrow(() -> new RuntimeException("Delay not found: " + id));
    }
}