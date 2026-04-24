import { api } from './api';

// PostgreSQL calls
export const searchTrains = (from, to, date) =>
  api.get(`/trains?from=${from}&to=${to}&date=${date}`);

export const getSchedule = (route, date) =>
  api.get(`/schedule?route=${route}&date=${date}`);

export const getSeats = (trainId) =>
  api.get(`/trains/${trainId}/seats`);

export const bookSeat = (trainId, seatNumber, passengerId) =>
  api.post('/bookings', { trainId, seatNumber, passengerId });

// MongoDB calls
export const getTelemedicineLog = (appointmentId) =>
  api.get(`/logs/${appointmentId}`);