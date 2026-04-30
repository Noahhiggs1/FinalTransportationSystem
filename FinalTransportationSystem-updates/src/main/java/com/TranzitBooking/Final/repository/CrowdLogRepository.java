package com.TranzitBooking.Final.repository;

import com.TranzitBooking.Final.model.nosql.CrowdLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CrowdLogRepository extends MongoRepository<CrowdLog, String> {
    List<CrowdLog> findByStationName(String stationName);
    List<CrowdLog> findByStatus(String status);
    List<CrowdLog> findBySensorId(String sensorId);
}
