import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/NavBar';
import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage';
import SchedulePage from './pages/SchedulePage';
import LoginPage from './pages/LoginPage';
import CustomerDashboard from './pages/CustomerDashboard';
import OperatorDashboard from './pages/OperatorDashboard';
import AdminPortal from './pages/AdminPortal';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div style={{ padding: '2rem' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<CustomerDashboard />} />
          <Route path="/operator" element={<OperatorDashboard />} />
          <Route path="/admin" element={<AdminPortal />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
