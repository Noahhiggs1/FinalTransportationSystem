package com.TranzitBooking.Final.repository;

import com.TranzitBooking.Final.model.sql.Route;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RouteRepository extends JpaRepository<Route, Long> {
}