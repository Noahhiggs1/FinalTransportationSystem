package com.TranzitBooking.Final.repository;

import com.TranzitBooking.Final.model.sql.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    List<Vehicle> findByRouteId(Long routeId);
}