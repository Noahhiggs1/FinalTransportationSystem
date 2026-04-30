package com.TranzitBooking.Final.service;

import com.TranzitBooking.Final.model.nosql.CrowdLog;
import com.TranzitBooking.Final.model.nosql.PassengerPattern;
import com.TranzitBooking.Final.repository.CrowdLogRepository;
import com.TranzitBooking.Final.repository.PassengerPatternRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Date;
import java.util.List;

@Service
public class AnalyticsService {

    @Autowired
    private CrowdLogRepository crowdLogRepository;

    @Autowired
    private PassengerPatternRepository passengerPatternRepository;

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
        return crowdLogRepository.save(log);
    }

    public List<CrowdLog> getCrowdByStation(String stationName) {
        return crowdLogRepository.findByStationName(stationName);
    }

    public List<CrowdLog> getCrowdByStatus(String status) {
        return crowdLogRepository.findByStatus(status);
    }

    public PassengerPattern buildPattern(String routeId, String stationOrigin,
                                         String stationDestination, String peakHour, int averageVolume) {
        PassengerPattern pattern = new PassengerPattern();
        pattern.setRouteId(routeId);
        pattern.setStationOrigin(stationOrigin);
        pattern.setStationDestination(stationDestination);
        pattern.setPeakHour(peakHour);
        pattern.setAverageVolume(averageVolume);
        pattern.setLastUpdated(new Date());
        return passengerPatternRepository.save(pattern);
    }

    public List<PassengerPattern> getPatternsByRoute(String routeId) {
        return passengerPatternRepository.findByRouteId(routeId);
    }

    public List<PassengerPattern> getAllPatterns() {
        return passengerPatternRepository.findAll();
    }
}
