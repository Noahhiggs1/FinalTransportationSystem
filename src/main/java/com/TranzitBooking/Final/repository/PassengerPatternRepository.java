package com.TranzitBooking.Final.repository;

import com.TranzitBooking.Final.model.nosql.PassengerPattern;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PassengerPatternRepository extends MongoRepository<PassengerPattern, String> {
    List<PassengerPattern> findByRouteId(String routeId);
    List<PassengerPattern> findByStationOrigin(String stationOrigin);
    List<PassengerPattern> findByPeakHour(String peakHour);
}
