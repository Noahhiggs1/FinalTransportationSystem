package com.TranzitBooking.Final.service;

import com.TranzitBooking.Final.model.nosql.CrowdLog;
import com.TranzitBooking.Final.model.nosql.PassengerPattern;
import org.springframework.stereotype.Service;
import java.util.Date;

@Service
public class AnalyticsService {

    public CrowdLog logCrowd(String logId, String stationName, String sensorId, int occupancyPercentage) {
        CrowdLog log = new CrowdLog();
        log.setLogId(logId);
        log.setStationName(stationName);
        log.setSensorId(sensorId);
        log.setOccupancyPercentage(occupancyPercentage);
        log.setTimestamp(new Date());
        if (occupancyPercentage > 80) {
            log.setStatus("Full");
        } else if (occupancyPercentage > 50) {
            log.setStatus("Busy");
        } else {
            log.setStatus("Available");
        }
        return log;
    }

    public PassengerPattern buildPattern(String routeId, String stationOrigin, String stationDestination, String peakHour, int averageVolume) {
        PassengerPattern pattern = new PassengerPattern();
        pattern.setRouteId(routeId);
        pattern.setStationOrigin(stationOrigin);
        pattern.setStationDestination(stationDestination);
        pattern.setPeakHour(peakHour);
        pattern.setAverageVolume(averageVolume);
        pattern.setLastUpdated(new Date());
        return pattern;
    }
}