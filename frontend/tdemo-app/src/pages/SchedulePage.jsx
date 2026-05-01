import { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function SchedulePage() {
  const [routes, setRoutes] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/routes')
      .then(data => setRoutes(data))
      .catch(err => console.error('Could not load routes:', err));
  }, []);

  useEffect(() => {
    if (!selectedRoute) return;
    setLoading(true);
    api.get(`/vehicles/route/${selectedRoute}`)
      .then(data => setVehicles(Array.isArray(data) ? data : []))
      .catch(err => console.error('Could not load vehicles:', err))
      .finally(() => setLoading(false));
  }, [selectedRoute]);

  const routeName = routes.find(r => String(r.routeId) === selectedRoute)?.name || '';

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem' }}>Train Schedule</h2>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '0.8rem', color: '#555' }}>ROUTE</label>
          <select value={selectedRoute} onChange={e => setSelectedRoute(e.target.value)} style={selectStyle}>
            <option value="">Select a route</option>
            {routes.map(r => (
              <option key={r.routeId} value={r.routeId}>{r.name} ({r.status})</option>
            ))}
          </select>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '0.8rem', color: '#555' }}>DATE</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} style={selectStyle} />
        </div>
      </div>

      {selectedRoute && date ? (
        <div>
          {loading ? (
            <p style={{ color: '#888' }}>Loading schedule...</p>
          ) : vehicles.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#aaa', border: '2px dashed #ddd', borderRadius: '12px' }}>
              <p>No trains scheduled for this route.</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#1a1a2e', color: '#fff' }}>
                  {['Train #', 'Route', 'Departure Time', 'Available Seats', 'Capacity', 'Status'].map(h => (
                    <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {vehicles.map((v, i) => (
                  <tr key={v.vehicleId} style={{ background: i % 2 === 0 ? '#f9f9f9' : '#fff', borderBottom: '1px solid #eee' }}>
                    <td style={tdStyle}>#{v.vehicleId}</td>
                    <td style={tdStyle}>{routeName}</td>
                    <td style={tdStyle}>{v.departureTime ? new Date(v.departureTime).toLocaleString() : 'TBD'}</td>
                    <td style={tdStyle}>{v.availableSeats}</td>
                    <td style={tdStyle}>{v.capacity}</td>
                    <td style={tdStyle}>
                      <span style={{
                        padding: '3px 10px', borderRadius: '20px', fontSize: '0.8rem',
                        background: v.routeId ? '#e8f5e9' : '#fff3e0',
                        color: v.routeId ? '#2e7d32' : '#e65100'
                      }}>
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#aaa', border: '2px dashed #ddd', borderRadius: '12px' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>???</div>
          <p>Select a route and date to view the schedule</p>
        </div>
      )}
    </div>
  );
}

const selectStyle = { padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', minWidth: '220px' };
const tdStyle = { padding: '0.75rem 1rem' };
