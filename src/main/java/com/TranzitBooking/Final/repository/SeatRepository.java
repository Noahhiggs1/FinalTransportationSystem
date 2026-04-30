package com.TranzitBooking.Final.repository;
import com.TranzitBooking.Final.model.sql.Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
@Repository
public interface SeatRepository extends JpaRepository<Seat, Long> {
    List<Seat> findByVehicleId(Long vehicleId);
    List<Seat> findByVehicleIdAndIsAvailable(Long vehicleId, boolean isAvailable);
    Optional<Seat> findByVehicleIdAndSeatNumber(Long vehicleId, String seatNumber);
}
