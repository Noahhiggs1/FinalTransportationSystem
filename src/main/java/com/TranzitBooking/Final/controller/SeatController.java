package com.TranzitBooking.Final.controller;

import com.TranzitBooking.Final.model.sql.Seat;
import com.TranzitBooking.Final.repository.SeatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/seats")
@CrossOrigin(origins = "http://localhost:3000")
public class SeatController {

    @Autowired
    private SeatRepository seatRepository;

    @GetMapping("/vehicle/{vehicleId}")
    public List<Seat> getSeatsByVehicle(@PathVariable Long vehicleId) {
        return seatRepository.findByVehicleId(vehicleId);
    }
}