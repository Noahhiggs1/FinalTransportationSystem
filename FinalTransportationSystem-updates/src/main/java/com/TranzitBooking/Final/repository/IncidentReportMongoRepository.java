package com.TranzitBooking.Final.repository;
import com.TranzitBooking.Final.model.nosql.IncidentReport;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface IncidentReportMongoRepository extends MongoRepository<IncidentReport, String> {
    List<IncidentReport> findByEmployeeIdOrderByReportedAtDesc(Long employeeId);
    List<IncidentReport> findByVehicleId(Long vehicleId);
}
