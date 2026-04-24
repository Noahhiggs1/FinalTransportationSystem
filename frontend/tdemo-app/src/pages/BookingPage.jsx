import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function BookingPage() {
  const [params] = useSearchParams();
  const [routes, setRoutes] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  const from = params.get('from') || '';
  const to = params.get('to') || '';

  // Load all routes first
  useEffect(() => {
    fetch('http://localhost:8081/api/routes')
      .then(res => res.json())
      .then(data => setRoutes(data))
      .catch(err => console.error('Could not load routes:', err));
  }, []);

  // When a route is selected load its vehicles
  const handleRouteSelect = (route) => {
    setSelectedRoute(route);
    setLoading(true);
    fetch(`http://localhost:8081/api/vehicles/route/${route.routeId}`)
      .then(res => res.json())
      .then(data => setVehicles(data))
      .catch(err => console.error('Could not load vehicles:', err))
      .finally(() => setLoading(false));
  };

  if (confirmed) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <div style={{ fontSize: '4rem' }}>✅</div>
        <h2>Booking Confirmed!</h2>
        <p style={{ color: '#555' }}>
          Route: {selectedRoute?.name} · Seat {selectedSeat}
        </p>
        <button
          onClick={() => { setConfirmed(false); setSelectedVehicle(null); setSelectedSeat(null); setSelectedRoute(null); }}
          style={btnPrimary}
        >
          Book Another
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ marginBottom: '0.25rem' }}>Book a Train</h2>
      <p style={{ color: '#777', marginBottom: '1.5rem' }}>
        {from && to ? `Searching: ${from} → ${to}` : 'Select a route below'}
      </p>

      {/* Step 1 — Pick a route */}
      {!selectedRoute && (
        <div>
          <h3 style={{ marginBottom: '1rem' }}>Available Routes</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {routes.length === 0 ? (
              <p style={{ color: '#888' }}>Loading routes...</p>
            ) : (
              routes.map(route => (
                <div
                  key={route.routeId}
                  onClick={() => handleRouteSelect(route)}
                  style={{
                    padding: '1.25rem 1.5rem',
                    border: '1px solid #e0e0e0',
                    borderRadius: '12px',
                    background: '#fff',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{route.name}</div>
                    <div style={{ color: '#777', fontSize: '0.9rem' }}>Click to see available trains</div>
                  </div>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    background: route.status === 'active' ? '#e8f5e9' : '#fff3e0',
                    color: route.status === 'active' ? '#2e7d32' : '#e65100'
                  }}>
                    {route.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Step 2 — Pick a vehicle */}
      {selectedRoute && !selectedVehicle && (
        <div>
          <button onClick={() => setSelectedRoute(null)} style={btnBack}>
            ← Back to routes
          </button>
          <h3>{selectedRoute.name}</h3>
          {loading ? (
            <p style={{ color: '#888' }}>Loading trains...</p>
          ) : vehicles.length === 0 ? (
            <p style={{ color: '#888' }}>No trains available for this route.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {vehicles.map(v => (
                <div key={v.vehicleId} style={{
                  padding: '1.25rem 1.5rem',
                  border: '1px solid #e0e0e0',
                  borderRadius: '12px',
                  background: '#fff',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  opacity: v.availableSeats === 0 ? 0.5 : 1
                }}>
                  <div>
                    <div style={{ fontWeight: 'bold' }}>Train #{v.vehicleId}</div>
                    <div style={{ color: '#777', fontSize: '0.9rem' }}>
                      Capacity: {v.capacity} · Occupied: {v.occupiedSeats}
                    </div>
                  </div>
                  <div style={{
                    color: v.availableSeats === 0 ? 'red' : v.availableSeats < 20 ? 'orange' : 'green',
                    fontSize: '0.9rem'
                  }}>
                    {v.availableSeats === 0 ? 'Sold out' : `${v.availableSeats} seats left`}
                  </div>
                  <button
                    disabled={v.availableSeats === 0}
                    onClick={() => setSelectedVehicle(v)}
                    style={v.availableSeats === 0 ? btnDisabled : btnPrimary}
                  >
                    Select
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 3 — Pick a seat */}
      {selectedVehicle && (
        <div>
          <button onClick={() => { setSelectedVehicle(null); setSelectedSeat(null); }} style={btnBack}>
            ← Back to trains
          </button>
          <h3>Pick a Seat — Train #{selectedVehicle.vehicleId}</h3>
          <p style={{ color: '#777', fontSize: '0.9rem' }}>
            ⬜ Available &nbsp; 🟩 Selected &nbsp; ⬛ Taken
            &nbsp;·&nbsp; {selectedVehicle.availableSeats} of {selectedVehicle.capacity} seats available
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(8, 48px)',
            gap: '8px',
            margin: '1rem 0'
          }}>
            {Array.from({ length: selectedVehicle.capacity }, (_, i) => i + 1).map(seat => {
              const taken = seat <= selectedVehicle.occupiedSeats;
              const isSelected = selectedSeat === seat;
              return (
                <button
                  key={seat}
                  disabled={taken}
                  onClick={() => setSelectedSeat(seat)}
                  style={{
                    height: '44px',
                    borderRadius: '6px',
                    border: '1px solid #ccc',
                    background: taken ? '#555' : isSelected ? '#4caf50' : '#f5f5f5',
                    color: taken ? '#999' : isSelected ? '#fff' : '#333',
                    cursor: taken ? 'not-allowed' : 'pointer',
                    fontWeight: isSelected ? 'bold' : 'normal'
                  }}
                >
                  {seat}
                </button>
              );
            })}
          </div>
          {selectedSeat && (
            <div style={{ marginTop: '1rem' }}>
              <p>Seat <strong>{selectedSeat}</strong> selected on <strong>{selectedRoute.name}</strong></p>
              <button onClick={() => setConfirmed(true)} style={btnPrimary}>
                Confirm Booking
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const btnPrimary = {
  padding: '0.6rem 1.4rem', background: '#1a1a2e', color: '#fff',
  border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.95rem'
};
const btnDisabled = {
  padding: '0.6rem 1.4rem', borderRadius: '8px', fontSize: '0.95rem',
  background: '#ccc', color: '#888', border: 'none', cursor: 'not-allowed'
};
const btnBack = {
  padding: '0.5rem 1rem', background: 'transparent', border: '1px solid #ccc',
  borderRadius: '8px', cursor: 'pointer', marginBottom: '1rem'
};