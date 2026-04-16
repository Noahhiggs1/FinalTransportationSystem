package com.TranzitBooking.Final.service;

import com.TranzitBooking.Final.model.nosql.DelayEvent;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
public class DelayService {

    public DelayEvent createDelayEvent(Long routeId, Long vehicleId, String cause, int delayMinutes) {
        DelayEvent event = new DelayEvent();
        event.setRouteId(routeId);
        event.setVehicleId(vehicleId);
        event.setCause(cause);
        event.setDelayMinutes(delayMinutes);
        event.setReportedAt(LocalDateTime.now());
        return event;
    }

    public String assessDelay(DelayEvent event) {
        if (event.getDelayMinutes() > 30) {
            return "SEVERE delay on route " + event.getRouteId();
        } else if (event.getDelayMinutes() > 10) {
            return "MODERATE delay on route " + event.getRouteId();
        }
        return "MINOR delay on route " + event.getRouteId();
    }
}
