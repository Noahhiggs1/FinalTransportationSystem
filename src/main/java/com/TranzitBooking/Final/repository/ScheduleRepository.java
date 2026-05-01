package com.TranzitBooking.Final.repository;

import com.TranzitBooking.Final.model.sql.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    List<Schedule> findByRouteIdOrderByStopSequenceAsc(Long routeId);
    List<Schedule> findByRouteIdAndDepartureTimeBetweenOrderByStopSequenceAsc(
        Long routeId, LocalDateTime start, LocalDateTime end
    );
}