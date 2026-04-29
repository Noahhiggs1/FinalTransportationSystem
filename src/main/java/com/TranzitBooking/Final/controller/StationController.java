package com.TranzitBooking.Final.controller;

import com.TranzitBooking.Final.model.sql.Station;
import com.TranzitBooking.Final.repository.StationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/stations")
@CrossOrigin(origins = "http://localhost:3000")
public class StationController {

    @Autowired
    private StationRepository stationRepository;

    @GetMapping
    public List<Station> getAllStations() {
        return stationRepository.findAll();
    }
}