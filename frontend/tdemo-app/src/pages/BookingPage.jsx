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
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [seatData, setSeatData] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('CARD');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [processing, setProcessing] = useState(false);

  const [confirmedTicket, setConfirmedTicket] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8081/api/routes')
      .then(res => res.json())
      .then(data => setRoutes(Array.isArray(data) ? data : []))
      .catch(err => { console.error('Could not load routes:', err); setRoutes([]); });
  }, []);

  const handleRouteSelect = (route) => {
    setSelectedRoute(route);
    setLoading(true);
    fetch(`http://localhost:8081/api/vehicles/route/${route.routeId}`)
      .then(res => res.json())
      .then(data => setVehicles(Array.isArray(data) ? data : []))
      .catch(err => { console.error('Could not load vehicles:', err); setVehicles([]); })
      .finally(() => setLoading(false));
  };

  
const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle);
    setSelectedSeat(null);
fetch(`http://localhost:8081/api/bookings/booked-seats/${vehicle.vehicleId}`)
  .then(res => res.json())
  .then(data => {
    console.log('booked seats:', data);
    setBookedSeats(Array.isArray(data) ? data : []);
  })
  .catch(() => setBookedSeats([]));
  };
  
  const getPrice = (vehicle) => {
    if (!vehicle) return 0;
    const base = 35;
    const demand = vehicle.availableSeats < 20 ? 15 : 0;
    return base + demand;
  };

  const handlePayment = () => {
    if (!cardNumber || !cardName || !cardExpiry || !cardCvv) {
      alert('Please fill in all payment details');
      return;
    }
    if (bookedSeats.includes(String(selectedSeat))) {
      alert('Sorry, that seat was just taken. Please choose another.');
      setSelectedSeat(null);
      return;
    }
    setProcessing(true);
    const bookingRequest = {
      userId: userId ? parseInt(userId) : null,
      vehicleId: selectedVehicle.vehicleId,
      seatNumber: selectedSeat,
      paymentMethod: paymentMethod,
      amount: getPrice(selectedVehicle),
      departureTime: null,
      arrivalTime: null
    };
    fetch('http://localhost:8081/api/bookings/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingRequest)
    })
      .then(res => {
        if (!res.ok) throw new Error('Booking failed');
        return res.json();
      })
      .then(ticket => {
        setConfirmedTicket(ticket);
        setShowPayment(false);
      })
      .catch(err => {
        alert('Booking failed: ' + err.message + '. Make sure you are logged in.');
      })
      .finally(() => setProcessing(false));
  };

  if (confirmedTicket) {
    return (
      <div style={{ maxWidth: '500px', margin: '3rem auto', textAlign: 'center' }}>
        <div style={{ background: '#fff', borderRadius: '20px', padding: '3rem', border: '1px solid #eee', boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>&#10003;</div>
          <h2 style={{ color: '#1a1a2e', marginBottom: '0.5rem' }}>Booking Confirmed!</h2>
          <p style={{ color: '#666', marginBottom: '2rem' }}>Your ticket has been saved to your account</p>
          <div style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e)', borderRadius: '16px', padding: '1.5rem', color: '#fff', textAlign: 'left', marginBottom: '1.5rem' }}>
            {[
              { label: 'TICKET ID', value: '#' + confirmedTicket.ticketId },
              { label: 'ROUTE', value: selectedRoute?.name },
              { label: 'SEAT', value: confirmedTicket.seatNumber },
              { label: 'STATUS', value: confirmedTicket.bookingStatus },
              { label: 'AMOUNT PAID', value: '$' + getPrice(selectedVehicle) },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ color: '#7a8fb5', fontSize: '0.8rem' }}>{item.label}</span>
                <span style={{ fontWeight: 'bold', color: item.label === 'STATUS' ? '#4ade80' : '#fff' }}>{item.value}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={() => navigate('/dashboard')} style={btnPrimary}>View My Tickets</button>
            <button onClick={() => { setConfirmedTicket(null); setSelectedRoute(null); setSelectedVehicle(null); setSelectedSeat(null); setBookedSeats([]); }} style={{ ...btnPrimary, background: 'transparent', color: '#1a1a2e', border: '1px solid #ddd' }}>Book Another</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {!isLoggedIn && (
        <div style={{ background: '#fff3e0', border: '1px solid #ffcc80', borderRadius: '10px', padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <span style={{ color: '#e65100', fontSize: '0.9rem' }}>You are browsing as a guest. Log in to save your ticket.</span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={() => navigate('/login')} style={{ padding: '0.4rem 1rem', background: '#e65100', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>Login</button>
            <button onClick={() => navigate('/login')} style={{ padding: '0.4rem 1rem', background: 'transparent', color: '#e65100', border: '1px solid #e65100', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>Create Account</button>
          </div>
        </div>
      )}

      <h2 style={{ marginBottom: '0.25rem' }}>Book a Train</h2>
      <p style={{ color: '#777', marginBottom: '1.5rem' }}>{from && to ? `${from} to ${to}` : 'Select a route to get started'}</p>

      {!selectedRoute && (
        <div>
          <h3 style={{ marginBottom: '1rem' }}>Step 1 - Choose Your Route</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {routes.length === 0 ? (
              <p style={{ color: '#888' }}>Loading routes...</p>
            ) : (
              routes.map(route => (
                <div key={route.routeId} onClick={() => handleRouteSelect(route)} style={{ padding: '1.25rem 1.5rem', border: '1px solid #e0e0e0', borderRadius: '12px', background: '#fff', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }} onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'} onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.05)'}>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '1.05rem' }}>{route.name}</div>
                    <div style={{ color: '#777', fontSize: '0.85rem', marginTop: '2px' }}>Click to see available trains</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', background: route.status?.toLowerCase() === 'active' ? '#e8f5e9' : '#fff3e0', color: route.status?.toLowerCase() === 'active' ? '#2e7d32' : '#e65100' }}>
                      {route.status?.toLowerCase() === 'active' ? 'Active' : route.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {selectedRoute && !selectedVehicle && (
        <div>
          <button onClick={() => { setSelectedRoute(null); setVehicles([]); }} style={btnBack}>Back to routes</button>
          <h3 style={{ marginBottom: '0.25rem' }}>Step 2 - Choose a Train</h3>
          <p style={{ color: '#777', marginBottom: '1rem', fontSize: '0.9rem' }}>{selectedRoute.name}</p>
          {loading ? (
            <p style={{ color: '#888' }}>Loading trains...</p>
          ) : vehicles.length === 0 ? (
            <p style={{ color: '#888' }}>No trains available for this route.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {vehicles.map(v => (
                <div key={v.vehicleId} style={{ padding: '1.25rem 1.5rem', border: '1px solid #e0e0e0', borderRadius: '12px', background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', opacity: v.availableSeats === 0 ? 0.5 : 1, boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '1.05rem' }}>Train #{v.vehicleId}</div>
                    <div style={{ color: '#777', fontSize: '0.85rem', marginTop: '2px' }}>Capacity: {v.capacity} total seats</div>
                    <div style={{ color: v.availableSeats === 0 ? '#c62828' : v.availableSeats < 20 ? '#e65100' : '#2e7d32', fontSize: '0.85rem', fontWeight: 'bold', marginTop: '2px' }}>
                      {v.availableSeats === 0 ? 'Sold out' : v.availableSeats < 20 ? `Only ${v.availableSeats} seats left` : `${v.availableSeats} seats available`}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '0.5rem' }}>${getPrice(v)}</div>
                    <button disabled={v.availableSeats === 0} onClick={() => handleVehicleSelect(v)} style={v.availableSeats === 0 ? btnDisabled : btnPrimary}>Select Train</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedVehicle && !showPayment && !confirmedTicket && (
        <div>
          <button onClick={() => { setSelectedVehicle(null); setSelectedSeat(null); setBookedSeats([]); }} style={btnBack}>Back to trains</button>
          <h3 style={{ marginBottom: '0.25rem' }}>Step 3 - Pick Your Seat</h3>
          <p style={{ color: '#777', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Train #{selectedVehicle.vehicleId} &middot; {selectedRoute.name}</p>
          <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem', fontSize: '0.85rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: 20, height: 20, background: '#f9f9f9', border: '1px solid #ddd', borderRadius: 4, display: 'inline-block' }}></span> Available
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: 20, height: 20, background: '#667eea', borderRadius: 4, display: 'inline-block' }}></span> Your selection
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: 20, height: 20, background: '#222', borderRadius: 4, display: 'inline-block' }}></span> Taken
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 48px) 2rem repeat(3, 48px)', gap: '8px', margin: '1rem 0' }}>
            {((() => { const cols = ['A','B','C','D','E','F']; const seats = []; for(let r=1; r<=Math.ceil(selectedVehicle.capacity/cols.length); r++) { for(let c=0; c<cols.length && seats.length<selectedVehicle.capacity; c++) { seats.push(r+cols[c]); } } return seats; })()).flatMap(seat => {
              const taken = bookedSeats.includes(seat);
              const isSelected = selectedSeat === seat;
              const btn = (
                <button key={seat} disabled={taken} onClick={() => !taken && setSelectedSeat(seat)} title={taken ? 'Already booked' : `Seat ${seat}`} style={{ width: '48px', height: '44px', borderRadius: '8px', border: isSelected ? '2px solid #667eea' : taken ? '1px solid #111' : '1px solid #ddd', background: taken ? '#2a2a2a' : isSelected ? '#667eea' : '#f9f9f9', color: taken ? '#555' : isSelected ? '#fff' : '#333', cursor: taken ? 'not-allowed' : 'pointer', fontWeight: isSelected ? 'bold' : 'normal', fontSize: '0.78rem' }}>
                  {taken ? '✕' : seat}
                </button>
              );
              return seat.endsWith('C') ? [btn, <div key={seat + '-aisle'} />] : [btn];
            })}
          </div>
          {selectedSeat && (
            <div style={{ marginTop: '1.5rem', padding: '1.25rem', background: '#f0f4ff', borderRadius: '12px', border: '1px solid #c7d2fe', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ fontWeight: 'bold', color: '#1a1a2e' }}>Seat {selectedSeat} &middot; {selectedRoute.name}</div>
                <div style={{ color: '#666', fontSize: '0.9rem' }}>Train #{selectedVehicle.vehicleId}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#1a1a2e' }}>${getPrice(selectedVehicle)}</div>
                <button onClick={() => { if (!isLoggedIn) { if (window.confirm('You need to log in to complete your purchase. Go to login?')) { navigate('/login'); } return; } setShowPayment(true); }} style={btnPrimary}>Proceed to Payment</button>
              </div>
            </div>
          )}
        </div>
      )}

      {showPayment && (
        <div>
          <button onClick={() => setShowPayment(false)} style={btnBack}>Back to seat selection</button>
          <h3 style={{ marginBottom: '0.25rem' }}>Step 4 - Payment</h3>
          <p style={{ color: '#777', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Seat {selectedSeat} &middot; {selectedRoute.name} &middot; Train #{selectedVehicle.vehicleId}</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', border: '1px solid #eee', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <h4 style={{ margin: '0 0 1.25rem' }}>Payment Details</h4>
              <div style={{ marginBottom: '1rem' }}>
                <label style={payLabel}>Payment Method</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {['CARD', 'PAYPAL'].map(method => (
                    <button key={method} onClick={() => setPaymentMethod(method)} style={{ flex: 1, padding: '0.5rem', border: paymentMethod === method ? '2px solid #667eea' : '1px solid #ddd', borderRadius: '8px', background: paymentMethod === method ? '#eef2ff' : '#fff', color: paymentMethod === method ? '#667eea' : '#666', cursor: 'pointer', fontWeight: paymentMethod === method ? 'bold' : 'normal', fontSize: '0.85rem' }}>
                      {method === 'CARD' ? 'Credit / Debit Card' : 'PayPal'}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={payLabel}>Name on Card</label>
                <input placeholder="John Smith" value={cardName} onChange={e => setCardName(e.target.value)} style={payInput} />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={payLabel}>Card Number</label>
                <input placeholder="1234 5678 9012 3456" value={cardNumber} onChange={e => setCardNumber(e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().substring(0, 19))} style={payInput} />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={payLabel}>Expiry Date</label>
                  <input placeholder="MM/YY" value={cardExpiry} onChange={e => setCardExpiry(e.target.value)} style={payInput} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={payLabel}>CVV</label>
                  <input placeholder="123" value={cardCvv} type="password" onChange={e => setCardCvv(e.target.value.replace(/\D/g, '').substring(0, 3))} style={payInput} />
                </div>
              </div>
              <button onClick={handlePayment} disabled={processing} style={{ width: '100%', padding: '0.9rem', background: processing ? '#888' : 'linear-gradient(135deg, #667eea, #764ba2)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: 'bold', cursor: processing ? 'not-allowed' : 'pointer' }}>
                {processing ? 'Processing...' : `Pay $${getPrice(selectedVehicle)}`}
              </button>
              <p style={{ textAlign: 'center', color: '#aaa', fontSize: '0.78rem', marginTop: '1rem' }}>Your payment information is secure and encrypted</p>
            </div>
            <div style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e)', borderRadius: '16px', padding: '1.5rem', color: '#fff' }}>
              <h4 style={{ margin: '0 0 1.5rem', color: '#fff' }}>Order Summary</h4>
              {[
                { label: 'Route', value: selectedRoute?.name },
                { label: 'Train', value: `#${selectedVehicle?.vehicleId}` },
                { label: 'Seat', value: selectedSeat },
                { label: 'Passenger', value: sessionStorage.getItem('userName') || 'Guest' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <span style={{ color: '#7a8fb5', fontSize: '0.85rem' }}>{item.label}</span>
                  <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{item.value}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
                <span style={{ color: '#fff', fontWeight: 'bold' }}>Total</span>
                <span style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#a78bfa' }}>${getPrice(selectedVehicle)}</span>
              </div>
              <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', fontSize: '0.8rem', color: '#7a8fb5' }}>
                Free cancellation within 24 hours<br />
                Ticket saved to your account<br />
                Email confirmation sent
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const btnPrimary = { padding: '0.6rem 1.4rem', background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 'bold' };
const btnDisabled = { padding: '0.6rem 1.4rem', borderRadius: '8px', fontSize: '0.95rem', background: '#ccc', color: '#888', border: 'none', cursor: 'not-allowed' };
const btnBack = { padding: '0.5rem 1rem', background: 'transparent', border: '1px solid #ccc', borderRadius: '8px', cursor: 'pointer', marginBottom: '1.5rem', fontSize: '0.9rem' };
const payLabel = { display: 'block', fontSize: '0.82rem', color: '#555', marginBottom: '4px', fontWeight: '500' };
const payInput = { width: '100%', padding: '0.65rem 0.9rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.95rem', boxSizing: 'border-box', outline: 'none' };






