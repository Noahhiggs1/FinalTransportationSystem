//Aniya
package com.TranzitBooking.Final.service;

import com.TranzitBooking.Final.model.sql.Ticket;
import com.TranzitBooking.Final.model.sql.Vehicle;
import org.springframework.stereotype.Service;


@Service
public class BookingService {

    public String bookTicket(Ticket ticket, Vehicle vehicle) {
        if (vehicle.getAvailableSeats() <= 0) {
            return "No seats available.";
        }
        vehicle.setOccupiedSeats(vehicle.getOccupiedSeats() + 1);
        vehicle.setAvailableSeats(vehicle.getAvailableSeats() - 1);
        ticket.setBookingStatus("CONFIRMED");
        return "Booking confirmed for seat " + ticket.getSeatNumber();
    }

    public String cancelTicket(Ticket ticket, Vehicle vehicle) {
        ticket.setBookingStatus("CANCELLED");
        vehicle.setOccupiedSeats(vehicle.getOccupiedSeats() - 1);
        vehicle.setAvailableSeats(vehicle.getAvailableSeats() + 1);
        return "Booking cancelled for seat " + ticket.getSeatNumber();
    }
}
