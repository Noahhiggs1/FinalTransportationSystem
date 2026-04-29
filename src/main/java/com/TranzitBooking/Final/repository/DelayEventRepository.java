package com.TranzitBooking.Final.repository;

import com.TranzitBooking.Final.model.nosql.DelayEvent;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DelayEventRepository extends MongoRepository<DelayEvent, String> {
    List<DelayEvent> findByEmployeeIdOrderByCreatedAtDesc(Long employeeId);
    List<DelayEvent> findByStatus(String status);
    List<DelayEvent> findByVehicleId(Long vehicleId);
}