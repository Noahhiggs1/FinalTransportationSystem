package com.TranzitBooking.Final.service;

import com.TranzitBooking.Final.model.nosql.DelayEvent;
import org.springframework.stereotype.Service;
import java.util.Date;
import java.util.List;

@Service
public class DelayService {

    public DelayEvent createDelayEvent(String eventId, String type, String severity, List<String> affectedLines, int estimatedDelayMinutes) {
        DelayEvent event = new DelayEvent();
        event.setEventId(eventId);
        event.setType(type);
        event.setSeverity(severity);
        event.setAffectedLines(affectedLines);
        event.setEstimatedDelayMinutes(estimatedDelayMinutes);
        event.setStatus("Active");
        event.setTimestamp(new Date());
        return event;
    }

    public String assessDelay(DelayEvent event) {
        if (event.getEstimatedDelayMinutes() > 30) {
            return "SEVERE delay - " + event.getSeverity();
        } else if (event.getEstimatedDelayMinutes() > 10) {
            return "MODERATE delay - " + event.getSeverity();
        }
        return "MINOR delay - " + event.getSeverity();
    }
}