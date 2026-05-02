//Aniya
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

    public DelayEvent createDelayEvent(String eventId, String type, String severity,
                                       List<String> affectedLines, int estimatedDelayMinutes,
                                       String incidentNarrative) {
        DelayEvent event = new DelayEvent();
        event.setEventId(eventId);
        event.setType(type);
        event.setSeverity(severity);
        event.setAffectedLines(affectedLines);
        event.setEstimatedDelayMinutes(estimatedDelayMinutes);
        event.setIncidentNarrative(incidentNarrative);
        event.setStatus("Active");
        event.setTimestamp(new Date());
        return delayEventRepository.save(event);
    }

    public List<DelayEvent> getActiveDelays() {
        return delayEventRepository.findByStatus("Active");
    }

    public List<DelayEvent> getDelaysByLine(String line) {
        return delayEventRepository.findByAffectedLinesContaining(line);
    }

    public DelayEvent resolveDelay(String id) {
        DelayEvent event = delayEventRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Delay event not found"));
        event.setStatus("Resolved");
        return delayEventRepository.save(event);
    }

    public String assessDelay(DelayEvent event) {
        if (event.getEstimatedDelayMinutes() > 30) {
            return "SEVERE delay - " + event.getSeverity();
        } else if (event.getEstimatedDelayMinutes() > 10) {
            return "MODERATE delay - " + event.getSeverity();
        }
        return "MINOR delay - " + event.getSeverity();
    }
    public List<DelayEvent> getAllDelays() {
    return delayEventRepository.findAll();
    }
}
