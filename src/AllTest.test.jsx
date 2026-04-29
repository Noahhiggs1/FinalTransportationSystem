import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Navbar from './components/NavBar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SchedulePage from './pages/SchedulePage';
import CustomerDashboard from './pages/CustomerDashboard';

// This is a fake version of fetch
// Instead of actually calling your backend
// it pretends to return data instantly
// Think of it like a fake vending machine
// that always gives you exactly what you test with
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([
      { routeId: 1, name: 'Atlantic Regional', status: 'active' },
      { routeId: 2, name: 'Northeast Express', status: 'active' }
    ])
  })
);

// This helper wraps any component in a router
// because our pages use Link and useNavigate
// which need a router to work
const wrap = (component) => (
  <BrowserRouter>{component}</BrowserRouter>
);

// Clean up after each test so they dont affect each other
afterEach(() => {
  sessionStorage.clear();
  jest.clearAllMocks();
});

// ─────────────────────────────────────────────────────
// NAVBAR TESTS
// Think of these like checking that all the buttons
// on a TV remote are labeled correctly
// ─────────────────────────────────────────────────────

describe('Navbar', () => {

  test('shows the brand name TranzitSystem', () => {
    render(wrap(<Navbar />));
    expect(screen.getByText(/TranzitSystem/i)).toBeInTheDocument();
  });

  test('shows Home link', () => {
    render(wrap(<Navbar />));
    expect(screen.getByText(/Home/i)).toBeInTheDocument();
  });

  test('shows Book a Train link', () => {
    render(wrap(<Navbar />));
    expect(screen.getByText(/Book a Train/i)).toBeInTheDocument();
  });

  test('shows Schedule link', () => {
    render(wrap(<Navbar />));
    expect(screen.getByText(/Schedule/i)).toBeInTheDocument();
  });

  test('shows Login when nobody is logged in', () => {
    sessionStorage.clear();
    render(wrap(<Navbar />));
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
  });

  test('shows Logout when someone is logged in', () => {
    sessionStorage.setItem('isLoggedIn', 'true');
    sessionStorage.setItem('userName', 'Chris Brown');
    render(wrap(<Navbar />));
    expect(screen.getByText(/Logout/i)).toBeInTheDocument();
  });

  test('shows My Account link when logged in', () => {
    sessionStorage.setItem('isLoggedIn', 'true');
    render(wrap(<Navbar />));
    expect(screen.getByText(/My Account/i)).toBeInTheDocument();
  });

});

// ─────────────────────────────────────────────────────
// HOME PAGE TESTS
// Think of these like checking that a store front
// has all the right signs and a working search bar
// ─────────────────────────────────────────────────────

describe('HomePage', () => {

  test('shows the Travel Smarter heading', () => {
    render(wrap(<HomePage />));
    expect(screen.getByText(/Travel Smarter/i)).toBeInTheDocument();
  });

  test('shows FROM input field', () => {
    render(wrap(<HomePage />));
    const inputs = screen.getAllByPlaceholderText(/City or station/i);
    expect(inputs[0]).toBeInTheDocument();
  });

  test('shows TO input field', () => {
    render(wrap(<HomePage />));
    const inputs = screen.getAllByPlaceholderText(/City or station/i);
    expect(inputs[1]).toBeInTheDocument();
  });

  test('shows Find Rides button', () => {
    render(wrap(<HomePage />));
    expect(screen.getByText(/Find Rides/i)).toBeInTheDocument();
  });

  test('shows alert when Find Rides clicked with empty fields', () => {
    render(wrap(<HomePage />));
    window.alert = jest.fn();
    fireEvent.click(screen.getByText(/Find Rides/i));
    expect(window.alert).toHaveBeenCalledWith('Please fill in all fields');
  });

  test('shows Easy Scheduling feature card', () => {
    render(wrap(<HomePage />));
    expect(screen.getByText(/Easy Scheduling/i)).toBeInTheDocument();
  });

  test('shows Pick Your Seat feature card', () => {
    render(wrap(<HomePage />));
    expect(screen.getByText(/Pick Your Seat/i)).toBeInTheDocument();
  });

  test('shows Wallet and Refunds feature card', () => {
    render(wrap(<HomePage />));
    expect(screen.getByText(/Wallet & Refunds/i)).toBeInTheDocument();
  });

});

// ─────────────────────────────────────────────────────
// LOGIN PAGE TESTS
// Think of these like checking that a door lock
// opens with the right key and stays locked
// with the wrong key
// ─────────────────────────────────────────────────────

describe('LoginPage', () => {

  test('shows email input field', () => {
    render(wrap(<LoginPage />));
    expect(screen.getByPlaceholderText(/you@email.com/i)).toBeInTheDocument();
  });

  test('shows password input field', () => {
    render(wrap(<LoginPage />));
    expect(screen.getByPlaceholderText(/••••••••/i)).toBeInTheDocument();
  });

  test('shows Sign In button', () => {
    render(wrap(<LoginPage />));
    expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
  });

  test('shows Customer tab', () => {
    render(wrap(<LoginPage />));
    expect(screen.getByText(/Customer/i)).toBeInTheDocument();
  });

  test('shows Employee tab', () => {
    render(wrap(<LoginPage />));
    expect(screen.getByText(/Employee/i)).toBeInTheDocument();
  });

  test('shows error when Sign In clicked with no email or password', async () => {
    render(wrap(<LoginPage />));
    fireEvent.click(screen.getByText(/Sign In/i));
    expect(
      await screen.findByText(/Please enter both email and password/i)
    ).toBeInTheDocument();
  });

  test('shows Continue as Guest button', () => {
    render(wrap(<LoginPage />));
    expect(screen.getByText(/Continue as Guest/i)).toBeInTheDocument();
  });

  test('shows Create Account option', () => {
    render(wrap(<LoginPage />));
    expect(screen.getByText(/Create one/i)).toBeInTheDocument();
  });

  test('shows registration form when Create one is clicked', () => {
    render(wrap(<LoginPage />));
    fireEvent.click(screen.getByText(/Create one/i));
    expect(screen.getByText(/Create Account/i)).toBeInTheDocument();
  });

});

// ─────────────────────────────────────────────────────
// SCHEDULE PAGE TESTS
// Think of these like checking that a bus schedule
// board shows up correctly and has working filters
// ─────────────────────────────────────────────────────

describe('SchedulePage', () => {

  test('shows Train Schedule heading', () => {
    render(wrap(<SchedulePage />));
    expect(screen.getByText(/Train Schedule/i)).toBeInTheDocument();
  });

  test('shows route dropdown with default option', () => {
    render(wrap(<SchedulePage />));
    expect(screen.getByText(/Select a route/i)).toBeInTheDocument();
  });

  test('shows placeholder message when nothing is selected', () => {
    render(wrap(<SchedulePage />));
    expect(
      screen.getByText(/Select a route and date to view the schedule/i)
    ).toBeInTheDocument();
  });

  test('calls backend to load routes on page open', async () => {
    render(wrap(<SchedulePage />));
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8081/api/routes'
      );
    });
  });

});

// ─────────────────────────────────────────────────────
// CUSTOMER DASHBOARD TESTS
// Think of these like checking that a bank app
// shows the right account info after you log in
// ─────────────────────────────────────────────────────

describe('CustomerDashboard', () => {

  beforeEach(() => {
    sessionStorage.setItem('isLoggedIn', 'true');
    sessionStorage.setItem('userId', '1');
    sessionStorage.setItem('userName', 'Chris Brown');
    sessionStorage.setItem('userEmail', 'chris.brown@email.com');
    sessionStorage.setItem('userRole', 'customer');
  });

  test('shows welcome message with user first name', async () => {
    render(wrap(<CustomerDashboard />));
    await waitFor(() => {
      expect(screen.getByText(/Welcome back, Chris/i)).toBeInTheDocument();
    });
  });

  test('shows Overview tab', async () => {
    render(wrap(<CustomerDashboard />));
    await waitFor(() => {
      expect(screen.getByText(/Overview/i)).toBeInTheDocument();
    });
  });

  test('shows My Tickets tab', async () => {
    render(wrap(<CustomerDashboard />));
    await waitFor(() => {
      expect(screen.getByText(/My Tickets/i)).toBeInTheDocument();
    });
  });

  test('shows Refunds tab', async () => {
    render(wrap(<CustomerDashboard />));
    await waitFor(() => {
      expect(screen.getByText(/Refunds/i)).toBeInTheDocument();
    });
  });

  test('shows Notifications tab', async () => {
    render(wrap(<CustomerDashboard />));
    await waitFor(() => {
      expect(screen.getByText(/Notifications/i)).toBeInTheDocument();
    });
  });

  test('shows Book a Train button', async () => {
    render(wrap(<CustomerDashboard />));
    await waitFor(() => {
      expect(screen.getByText(/Book a Train/i)).toBeInTheDocument();
    });
  });

  test('shows Logout button', async () => {
    render(wrap(<CustomerDashboard />));
    await waitFor(() => {
      expect(screen.getByText(/Logout/i)).toBeInTheDocument();
    });
  });

  test('shows stat cards for tickets notifications and refunds', async () => {
    render(wrap(<CustomerDashboard />));
    await waitFor(() => {
      expect(screen.getByText(/Total Tickets/i)).toBeInTheDocument();
      expect(screen.getByText(/Pending Refunds/i)).toBeInTheDocument();
    });
  });

});