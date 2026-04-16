package com.TranzitBooking.Final.service;

import com.TranzitBooking.Final.model.nosql.CrowdLog;
import com.TranzitBooking.Final.model.nosql.PassengerPattern;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class AnalyticsService {

    public CrowdLog logCrowd(Long stationId, Long vehicleId, int passengerCount) {
        CrowdLog log = new CrowdLog();
        log.setStationId(stationId);
        log.setVehicleId(vehicleId);
        log.setPassengerCount(passengerCount);
        log.setLoggedAt(LocalDateTime.now());
        if (passengerCount > 80) {
            log.setCrowdLevel("HIGH");
        } else if (passengerCount > 40) {
            log.setCrowdLevel("MEDIUM");
        } else {
            log.setCrowdLevel("LOW");
        }
        return log;
    }

    public PassengerPattern buildPattern(Long userId, List<Long> routes, List<String> peakHours, String paymentMethod) {
        PassengerPattern pattern = new PassengerPattern();
        pattern.setUserId(userId);
        pattern.setFrequentRoutes(routes);
        pattern.setPeakHours(peakHours);
        pattern.setPreferredPaymentMethod(paymentMethod);
        return pattern;
    }
}
