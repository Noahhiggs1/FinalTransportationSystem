package com.TranzitBooking.Final.service;

import com.TranzitBooking.Final.model.sql.Route;
import com.TranzitBooking.Final.model.sql.RouteStation;
import org.springframework.stereotype.Service;



@Service
public class RouteService {
    public Route createRoute(String name, String status) {
        Route route = new Route();
        route.setName(name);
        route.setStatus(status);
        return route;
    }

    public RouteStation addStationToRoute(Long routeId, Long stationId, int stopSequence) {
        RouteStation rs = new RouteStation();
        rs.setRouteId(routeId);
        rs.setStationId(stationId);
        rs.setStopSequence(stopSequence);
        return rs;
    }
}