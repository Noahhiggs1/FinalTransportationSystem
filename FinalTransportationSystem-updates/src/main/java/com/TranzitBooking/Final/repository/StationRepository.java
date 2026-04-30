package com.TranzitBooking.Final.repository;
import com.TranzitBooking.Final.model.sql.Station;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface StationRepository extends JpaRepository<Station, Long> {
}
