package com.TranzitBooking.Final.service;

import com.TranzitBooking.Final.model.sql.Ticket;
import com.TranzitBooking.Final.model.sql.Payment;
import com.TranzitBooking.Final.model.sql.Vehicle;
import com.TranzitBooking.Final.model.sql.Seat;
import com.TranzitBooking.Final.repository.TicketRepository;
import com.TranzitBooking.Final.repository.PaymentRepository;
import com.TranzitBooking.Final.repository.VehicleRepository;
import com.TranzitBooking.Final.repository.SeatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class BookingService {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private SeatRepository seatRepository;

    @Transactional
    public List<Ticket> bookMultipleSeats(Long userId, Long vehicleId,
                                           List<String> seatNumbers,
                                           String paymentMethod,
                                           String paymentToken,
                                           Double totalAmount) {

        if (seatNumbers.size() > 6) {
            throw new RuntimeException(
                "You can only book a maximum of 6 seats at one time"
            );
        }

        Optional<Vehicle> vehicleOpt = vehicleRepository.findById(vehicleId);
        if (vehicleOpt.isEmpty()) {
            throw new RuntimeException("Vehicle not found");
        }

        Vehicle vehicle = vehicleOpt.get();

        if (vehicle.getAvailableSeats() < seatNumbers.size()) {
            throw new RuntimeException(
                "Not enough seats available. Only " + 
                vehicle.getAvailableSeats() + " seats left"
            );
        }

        List<Seat> seatsToBook = new ArrayList<>();
        for (String seatNumber : seatNumbers) {

            Optional<Seat> seatOpt = seatRepository
                .findByVehicleIdAndSeatNumber(vehicleId, seatNumber);

            if (seatOpt.isEmpty()) {
                throw new RuntimeException(
                    "Seat " + seatNumber + " does not exist on this vehicle"
                );
            }

            Seat seat = seatOpt.get();

            if (!seat.isAvailable()) {
                throw new RuntimeException(
                    "Seat " + seatNumber + " was just taken by another passenger. " +
                    "Please choose a different seat."
                );
            }

            seatsToBook.add(seat);
        }

        List<Ticket> savedTickets = new ArrayList<>();

        for (Seat seat : seatsToBook) {
            seat.setIsAvailable(false);
            seatRepository.save(seat);

            Ticket ticket = new Ticket();
            ticket.setUserId(userId);
            ticket.setVehicleId(vehicleId);
            ticket.setSeatNumber(seat.getSeatNumber());
            ticket.setBookingStatus("CONFIRMED");
            ticket.setBookingTimestamp(LocalDateTime.now());
            ticket.setTripTimestamp(LocalDateTime.now());

            Ticket savedTicket = ticketRepository.save(ticket);
            savedTickets.add(savedTicket);
        }

        String transactionRef = paymentToken != null && !paymentToken.isEmpty()
            ? paymentToken
            : "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Payment payment = new Payment();
        payment.setTicketId(savedTickets.get(0).getTicketId());
        payment.setMethod(paymentMethod != null ? paymentMethod : "PAYPAL");
        payment.setAmount(totalAmount != null ? totalAmount : 0.0);
        payment.setStatus("COMPLETED");
        payment.setTransactionRef(transactionRef);
        paymentRepository.save(payment);

        vehicle.setAvailableSeats(vehicle.getAvailableSeats() - seatNumbers.size());
        vehicle.setOccupiedSeats(vehicle.getOccupiedSeats() + seatNumbers.size());
        vehicleRepository.save(vehicle);

        return savedTickets;
    }

    @Transactional
    public String cancelTicket(Long ticketId) {

        Optional<Ticket> ticketOpt = ticketRepository.findById(ticketId);
        if (ticketOpt.isEmpty()) {
            throw new RuntimeException("Ticket not found");
        }

        Ticket ticket = ticketOpt.get();

        if (!ticket.getBookingStatus().equals("CONFIRMED")) {
            throw new RuntimeException(
                "Only confirmed tickets can be cancelled"
            );
        }

        ticket.setBookingStatus("CANCELLED");
        ticketRepository.save(ticket);

        Optional<Seat> seatOpt = seatRepository
            .findByVehicleIdAndSeatNumber(
                ticket.getVehicleId(),
                ticket.getSeatNumber()
            );

        if (seatOpt.isPresent()) {
            Seat seat = seatOpt.get();
            seat.setIsAvailable(true);
            seatRepository.save(seat);
        }

        Optional<Vehicle> vehicleOpt = vehicleRepository
            .findById(ticket.getVehicleId());

        if (vehicleOpt.isPresent()) {
            Vehicle vehicle = vehicleOpt.get();
            vehicle.setAvailableSeats(vehicle.getAvailableSeats() + 1);
            vehicle.setOccupiedSeats(vehicle.getOccupiedSeats() - 1);
            vehicleRepository.save(vehicle);
        }

        return "Ticket #" + ticketId + " cancelled. Seat " +
            ticket.getSeatNumber() + " is now available again.";
    }
}