package com.TranzitBooking.Final.repository;
import com.TranzitBooking.Final.model.sql.WorkLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
@Repository
public interface WorkLogRepository extends JpaRepository<WorkLog, Long> {
    List<WorkLog> findByEmployeeIdOrderByLogDateDesc(Long employeeId);
    Optional<WorkLog> findByEmployeeIdAndClockOutIsNull(Long employeeId);
}
