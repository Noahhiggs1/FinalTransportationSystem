import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function BookingPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const userId = sessionStorage.getItem('userId');
  const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
  const from = params.get('from') || '';
  const to = params.get('to') || '';

  const [routes, setRoutes] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [seats, setSeats] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('PAYPAL');
  const [processing, setProcessing] = useState(false);
  const [confirmedTickets, setConfirmedTickets] = useState(null);
  const [seatError, setSeatError] = useState('');

  const MAX_SEATS = 6;
  const BASE_URL = 'http://localhost:8081/api';

  useEffect(() => {
    fetch(`${BASE_URL}/routes`)
      .then(res => res.json())
      .then(data => setRoutes(Array.isArray(data) ? data : []))
      .catch(err => console.error('Could not load routes:', err));
  }, []);

  const handleRouteSelect = (route) => {
    setSelectedRoute(route);
    setLoading(true);
    fetch(`${BASE_URL}/vehicles/route/${route.routeId}`)
      .then(res => res.json())
      .then(data => setVehicles(Array.isArray(data) ? data : []))
      .catch(err => console.error('Could not load vehicles:', err))
      .finally(() => setLoading(false));
  };

  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle);
    setSelectedSeats([]);
    setSeatError('');
    setLoading(true);

    fetch(`${BASE_URL}/seats/vehicle/${vehicle.vehicleId}`)
      .then(res => res.json())
      .then(data => {
        console.log('Raw seat data from backend:', data);
        setSeats(Array.isArray(data) ? data : []);
      })
      .catch(err => console.error('Could not load seats:', err))
      .finally(() => setLoading(false));
  };

  const isSeatAvailable = (seat) => {
    if (!seat) return false;
    if (typeof seat.isAvailable === 'boolean') return seat.isAvailable;
    if (typeof seat.available === 'boolean') return seat.available;
    return false;
  };

  const toggleSeat = (seat) => {
    const available = isSeatAvailable(seat);
    if (!available) return;

    const alreadyPicked = selectedSeats.find(
      s => s.seatNumber === seat.seatNumber
    );

    if (alreadyPicked) {
      setSelectedSeats(prev =>
        prev.filter(s => s.seatNumber !== seat.seatNumber)
      );
      setSeatError('');
    } else {
      if (selectedSeats.length >= MAX_SEATS) {
        setSeatError(`Maximum ${MAX_SEATS} seats per booking`);
        return;
      }
      setSelectedSeats(prev => [...prev, seat]);
      setSeatError('');
    }
  };

  const getPrice = () => {
    if (!selectedVehicle) return 0;
    const pricePerSeat = selectedVehicle.availableSeats < 20 ? 50 : 35;
    return pricePerSeat * Math.max(selectedSeats.length, 1);
  };

  const handlePayment = (method) => {
    if (selectedSeats.length === 0) {
      setSeatError('Please select at least one seat');
      return;
    }
    setProcessing(true);
    setPaymentMethod(method);

    const token = method === 'PAYPAL'
      ? 'PP-' + Math.random().toString(36).substring(2, 10).toUpperCase()
      : 'STR-' + Math.random().toString(36).substring(2, 10).toUpperCase();

    const bookingRequest = {
      userId: userId ? parseInt(userId) : null,
      vehicleId: selectedVehicle.vehicleId,
      seatNumbers: selectedSeats.map(s => s.seatNumber),
      paymentMethod: method,
      paymentToken: token,
      amount: getPrice()
    };

    fetch(`${BASE_URL}/bookings/book`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingRequest)
    })
      .then(res => {
        if (!res.ok) return res.text().then(t => { throw new Error(t); });
        return res.json();
      })
      .then(tickets => {
        setConfirmedTickets(Array.isArray(tickets) ? tickets : [tickets]);
        setShowPayment(false);
        setSeats(prev => prev.map(s =>
          selectedSeats.find(sel => sel.seatNumber === s.seatNumber)
            ? { ...s, isAvailable: false, available: false }
            : s
        ));
      })
      .catch(err => alert('Booking failed: ' + err.message))
      .finally(() => setProcessing(false));
  };

  const SeatMap = () => {
    if (loading) {
      return (
        <div style={{
          padding: '3rem',
          textAlign: 'center',
          color: '#888'
        }}>
          Loading seats...
        </div>
      );
    }

    if (seats.length === 0) {
      return (
        <div style={{
          padding: '3rem',
          textAlign: 'center',
          color: '#888',
          border: '2px dashed #ddd',
          borderRadius: '12px'
        }}>
          No seats found for this train.
        </div>
      );
    }

    const rows = [...new Set(seats.map(s => s.seatNumber.split('-')[0]))].sort();
    const cols = [...new Set(seats.map(s => s.seatNumber.split('-')[1]))].sort();

    return (
      <div>

        <div style={{
          display: 'flex',
          gap: '1.5rem',
          marginBottom: '1rem',
          flexWrap: 'wrap'
        }}>
          {[
            { bg: '#e8f5e9', border: '1px solid #a5d6a7', label: 'Available', textColor: '#2e7d32' },
            { bg: '#667eea', border: 'none', label: 'Selected', textColor: '#fff' },
            { bg: '#bbb', border: 'none', label: 'Taken', textColor: '#fff' },
          ].map(item => (
            <div key={item.label} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <div style={{
                width: '28px',
                height: '28px',
                background: item.bg,
                border: item.border,
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.6rem',
                color: item.textColor,
                fontWeight: 'bold'
              }}>
                {item.label === 'Selected' ? '✓' : ''}
              </div>
              <span style={{ fontSize: '0.85rem', color: '#555' }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>

        <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: '1rem' }}>
          Click a green seat to select it. Click again to deselect.
          You can pick up to {MAX_SEATS} seats.
          Currently selected: <strong>{selectedSeats.length}</strong>
        </p>

        {seatError && (
          <p style={{
            color: '#c62828',
            fontSize: '0.85rem',
            marginBottom: '0.5rem',
            padding: '0.5rem 1rem',
            background: '#ffebee',
            borderRadius: '6px'
          }}>
            {seatError}
          </p>
        )}

        <div style={{
          display: 'inline-block',
          background: '#f8f8f8',
          borderRadius: '16px',
          padding: '1.25rem',
          border: '1px solid #eee'
        }}>

          <div style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '8px',
            paddingLeft: '40px'
          }}>
            {cols.map((col, i) => (
              <div key={col} style={{
                width: '48px',
                textAlign: 'center',
                fontSize: '0.75rem',
                color: '#999',
                fontWeight: 'bold',
                marginRight: i === 0 && cols.length === 3 ? '16px' : '0'
              }}>
                {col}
              </div>
            ))}
          </div>

          {rows.map(row => (
            <div key={row} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '6px'
            }}>

              <div style={{
                width: '32px',
                fontSize: '0.75rem',
                color: '#999',
                textAlign: 'right',
                fontWeight: 'bold',
                flexShrink: 0
              }}>
                {row}
              </div>

              {cols.map((col, colIndex) => {
                const seatNumber = `${row}-${col}`;
                const seat = seats.find(s => s.seatNumber === seatNumber);
                const available = seat ? isSeatAvailable(seat) : false;
                const selected = selectedSeats.some(
                  s => s.seatNumber === seatNumber
                );

                let bgColor = '#bbb';
                let textColor = '#888';
                let cursor = 'not-allowed';
                let borderStyle = '1px solid #aaa';

                if (available && !selected) {
                  bgColor = '#e8f5e9';
                  textColor = '#2e7d32';
                  cursor = 'pointer';
                  borderStyle = '1px solid #a5d6a7';
                }

                if (selected) {
                  bgColor = '#667eea';
                  textColor = '#fff';
                  cursor = 'pointer';
                  borderStyle = '2px solid #4338ca';
                }

                return (
                  <button
                    key={seatNumber}
                    onClick={() => seat && toggleSeat(seat)}
                    style={{
                      width: '48px',
                      height: '38px',
                      borderRadius: '8px',
                      border: borderStyle,
                      background: bgColor,
                      color: textColor,
                      cursor: cursor,
                      fontSize: '0.7rem',
                      fontWeight: 'bold',
                      marginRight: colIndex === 0 && cols.length === 3
                        ? '16px' : '0',
                      transition: 'all 0.15s',
                      outline: 'none',
                      pointerEvents: available || selected ? 'auto' : 'none'
                    }}
                    title={`${seatNumber} — ${available ? 'Available' : 'Taken'}`}
                  >
                    {row}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (confirmedTickets) {
    return (
      <div style={{ maxWidth: '500px', margin: '3rem auto', textAlign: 'center' }}>
        <div style={{
          background: '#fff', borderRadius: '20px',
          padding: '2.5rem', border: '1px solid #eee',
          boxShadow: '0 8px 30px rgba(0,0,0,0.08)'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
          <h2>Booking Confirmed!</h2>
          <p style={{ color: '#666', marginBottom: '1.5rem' }}>
            {confirmedTickets.length} ticket
            {confirmedTickets.length > 1 ? 's' : ''} saved to your account
          </p>
          <div style={{
            background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
            borderRadius: '16px', padding: '1.5rem',
            color: '#fff', textAlign: 'left', marginBottom: '1.5rem'
          }}>
            {[
              ['ROUTE', selectedRoute?.name],
              ['SEATS', selectedSeats.map(s => s.seatNumber).join(', ')],
              ['TOTAL PAID', `$${getPrice()}`],
              ['STATUS', 'CONFIRMED'],
            ].map(([label, value]) => (
              <div key={label} style={{
                display: 'flex', justifyContent: 'space-between',
                padding: '0.6rem 0',
                borderBottom: '1px solid rgba(255,255,255,0.1)'
              }}>
                <span style={{ color: '#7a8fb5', fontSize: '0.8rem' }}>
                  {label}
                </span>
                <span style={{
                  fontWeight: 'bold',
                  color: label === 'STATUS' ? '#4ade80' : '#fff'
                }}>
                  {value}
                </span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={() => navigate('/dashboard')} style={btnPrimary}>
              View My Tickets
            </button>
            <button onClick={() => {
              setConfirmedTickets(null);
              setSelectedRoute(null);
              setSelectedVehicle(null);
              setSelectedSeats([]);
              setSeats([]);
            }} style={btnOutline}>
              Book Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>

      {!isLoggedIn && (
        <div style={{
          background: '#fff3e0', border: '1px solid #ffcc80',
          borderRadius: '10px', padding: '1rem 1.25rem',
          marginBottom: '1.5rem', display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center', flexWrap: 'wrap', gap: '1rem'
        }}>
          <span style={{ color: '#e65100', fontSize: '0.9rem' }}>
            ⚠️ Log in to save your ticket to your account
          </span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={() => navigate('/login')} style={btnPrimary}>
              Login
            </button>
            <button onClick={() => navigate('/login')} style={btnOutline}>
              Create Account
            </button>
          </div>
        </div>
      )}

      <h2 style={{ marginBottom: '0.25rem' }}>Book a Train</h2>
      <p style={{ color: '#777', marginBottom: '1.5rem' }}>
        {from && to ? `${from} → ${to}` : 'Select a route to get started'}
      </p>

      {!selectedRoute && (
        <div>
          <h3 style={{ marginBottom: '1rem' }}>Step 1 — Choose Your Route</h3>
          {routes.length === 0 ? (
            <p style={{ color: '#888' }}>Loading routes...</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {routes.map(route => (
                <div key={route.routeId}
                  onClick={() => handleRouteSelect(route)}
                  style={{
                    padding: '1.25rem 1.5rem',
                    border: '1px solid #e0e0e0',
                    borderRadius: '12px',
                    background: '#fff',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                    transition: 'box-shadow 0.2s'
                  }}
                  onMouseEnter={e =>
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
                  }
                  onMouseLeave={e =>
                    e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.05)'
                  }
                >
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '1.05rem' }}>
                      {route.name}
                    </div>
                    <div style={{ color: '#888', fontSize: '0.85rem' }}>
                      Click to see available trains
                    </div>
                  </div>
                  <span style={{
                    padding: '4px 12px', borderRadius: '20px',
                    fontSize: '0.8rem', fontWeight: 'bold',
                    background: '#e8f5e9', color: '#2e7d32'
                  }}>
                    {route.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedRoute && !selectedVehicle && (
        <div>
          <button
            onClick={() => { setSelectedRoute(null); setVehicles([]); }}
            style={btnBack}
          >
            ← Back to routes
          </button>
          <h3 style={{ marginBottom: '0.5rem' }}>Step 2 — Choose a Train</h3>
          <p style={{ color: '#777', marginBottom: '1rem' }}>
            {selectedRoute.name}
          </p>
          {loading ? (
            <p style={{ color: '#888' }}>Loading trains...</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {vehicles.length === 0 ? (
                <p style={{ color: '#888' }}>No trains available for this route.</p>
              ) : vehicles.map(v => (
                <div key={v.vehicleId} style={{
                  padding: '1.25rem 1.5rem',
                  border: '1px solid #e0e0e0',
                  borderRadius: '12px', background: '#fff',
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', flexWrap: 'wrap', gap: '1rem',
                  opacity: v.availableSeats === 0 ? 0.5 : 1
                }}>
                  <div>
                    <div style={{ fontWeight: 'bold' }}>
                      Train #{v.vehicleId}
                    </div>
                    <div style={{ color: '#777', fontSize: '0.85rem' }}>
                      {v.availableSeats} of {v.capacity} seats available
                    </div>
                  </div>
                  <button
                    disabled={v.availableSeats === 0}
                    onClick={() => handleVehicleSelect(v)}
                    style={v.availableSeats === 0 ? btnDisabled : btnPrimary}
                  >
                    Select Train
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedVehicle && !showPayment && (
        <div>
          <button onClick={() => {
            setSelectedVehicle(null);
            setSelectedSeats([]);
            setSeats([]);
          }} style={btnBack}>
            ← Back to trains
          </button>
          <h3 style={{ marginBottom: '0.25rem' }}>Step 3 — Pick Your Seats</h3>
          <p style={{ color: '#777', marginBottom: '1rem', fontSize: '0.9rem' }}>
            Train #{selectedVehicle.vehicleId} · {selectedRoute.name}
          </p>

          <SeatMap />

          {selectedSeats.length > 0 && (
            <div style={{
              marginTop: '1.5rem', padding: '1.25rem',
              background: '#f0f4ff', borderRadius: '12px',
              border: '1px solid #c7d2fe'
            }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', flexWrap: 'wrap', gap: '1rem'
              }}>
                <div>
                  <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                    Your Selected Seats
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {selectedSeats.map(s => (
                      <span key={s.seatNumber} style={{
                        background: '#667eea', color: '#fff',
                        padding: '4px 12px', borderRadius: '12px',
                        fontSize: '0.85rem', fontWeight: 'bold',
                        display: 'flex', alignItems: 'center', gap: '6px'
                      }}>
                        {s.seatNumber}
                        <span
                          onClick={() => toggleSeat(s)}
                          style={{ cursor: 'pointer', fontSize: '1rem' }}
                        >
                          ×
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: '#1a1a2e'
                  }}>
                    ${getPrice()}
                  </div>
                  <div style={{ color: '#888', fontSize: '0.8rem' }}>
                    {selectedSeats.length} seat
                    {selectedSeats.length > 1 ? 's' : ''}
                  </div>
                  <button
                    onClick={() => {
                      if (!isLoggedIn) {
                        if (window.confirm(
                          'You need to log in to complete your purchase. Go to login?'
                        )) navigate('/login');
                        return;
                      }
                      setShowPayment(true);
                    }}
                    style={{ ...btnPrimary, marginTop: '8px' }}
                  >
                    Proceed to Payment →
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {showPayment && (
        <div>
          <button onClick={() => setShowPayment(false)} style={btnBack}>
            ← Back to seat selection
          </button>
          <h3>Step 4 — Payment</h3>
          <p style={{ color: '#777', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            Seats: {selectedSeats.map(s => s.seatNumber).join(', ')}
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1.5rem'
          }}>
            <div style={{
              background: '#fff', borderRadius: '16px',
              padding: '1.5rem', border: '1px solid #eee'
            }}>
              <h4 style={{ margin: '0 0 0.5rem' }}>Choose Payment Method</h4>
              <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                We never store your card details. All payments are
                handled securely by PayPal or Stripe.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <button
                  onClick={() => handlePayment('PAYPAL')}
                  disabled={processing}
                  style={{
                    width: '100%', padding: '1rem',
                    background: processing ? '#ccc' : '#003087',
                    color: '#fff', border: 'none',
                    borderRadius: '10px', fontSize: '1rem',
                    fontWeight: 'bold',
                    cursor: processing ? 'not-allowed' : 'pointer'
                  }}
                >
                  {processing && paymentMethod === 'PAYPAL'
                    ? '⏳ Processing...'
                    : '🅿️ Pay with PayPal'}
                </button>

                <button
                  onClick={() => handlePayment('STRIPE')}
                  disabled={processing}
                  style={{
                    width: '100%', padding: '1rem',
                    background: processing ? '#ccc' : '#635bff',
                    color: '#fff', border: 'none',
                    borderRadius: '10px', fontSize: '1rem',
                    fontWeight: 'bold',
                    cursor: processing ? 'not-allowed' : 'pointer'
                  }}
                >
                  {processing && paymentMethod === 'STRIPE'
                    ? '⏳ Processing...'
                    : '💳 Pay with Stripe'}
                </button>
              </div>

              <p style={{
                textAlign: 'center', color: '#aaa',
                fontSize: '0.78rem', marginTop: '1rem'
              }}>
                🔒 Secured by PayPal and Stripe
              </p>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
              borderRadius: '16px', padding: '1.5rem', color: '#fff'
            }}>
              <h4 style={{ margin: '0 0 1.5rem', color: '#fff' }}>
                Order Summary
              </h4>
              {[
                ['Route', selectedRoute?.name],
                ['Train', `#${selectedVehicle?.vehicleId}`],
                ['Seats', selectedSeats.map(s => s.seatNumber).join(', ')],
                ['Passenger', sessionStorage.getItem('userName') || 'Guest'],
              ].map(([label, value]) => (
                <div key={label} style={{
                  display: 'flex', justifyContent: 'space-between',
                  padding: '0.6rem 0',
                  borderBottom: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <span style={{ color: '#7a8fb5', fontSize: '0.85rem' }}>
                    {label}
                  </span>
                  <span style={{
                    fontWeight: 'bold', fontSize: '0.85rem',
                    maxWidth: '200px', textAlign: 'right'
                  }}>
                    {value}
                  </span>
                </div>
              ))}
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                marginTop: '1rem', paddingTop: '0.5rem'
              }}>
                <span style={{ color: '#fff', fontWeight: 'bold' }}>
                  Total
                </span>
                <span style={{
                  fontSize: '1.4rem',
                  fontWeight: 'bold',
                  color: '#a78bfa'
                }}>
                  ${getPrice()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const btnPrimary = {
  padding: '0.6rem 1.4rem', background: '#1a1a2e',
  color: '#fff', border: 'none', borderRadius: '8px',
  cursor: 'pointer', fontSize: '0.95rem', fontWeight: 'bold'
};
const btnOutline = {
  padding: '0.6rem 1.4rem', background: 'transparent',
  color: '#1a1a2e', border: '1px solid #1a1a2e',
  borderRadius: '8px', cursor: 'pointer', fontSize: '0.95rem'
};
const btnDisabled = {
  padding: '0.6rem 1.4rem', borderRadius: '8px',
  fontSize: '0.95rem', background: '#ccc',
  color: '#888', border: 'none', cursor: 'not-allowed'
};
const btnBack = {
  padding: '0.5rem 1rem', background: 'transparent',
  border: '1px solid #ccc', borderRadius: '8px',
  cursor: 'pointer', marginBottom: '1.5rem', fontSize: '0.9rem'
};