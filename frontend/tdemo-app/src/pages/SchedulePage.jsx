import { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function SchedulePage() {
  const [routes, setRoutes] = useState([]);
  const [stations, setStations] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    api.get('/routes').then(data => setRoutes(data)).catch(console.error);
    api.get('/stations').then(data => setStations(data)).catch(console.error);
  }, []);

  const handleSearch = () => {
    if (!selectedRoute || !date) return alert('Please select a route and date');
    setLoading(true);
    setSearched(true);
    api.get(`/schedules/route/${selectedRoute}/date?date=${date}`)
      .then(data => setSchedules(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const routeName = routes.find(r => String(r.routeId) === selectedRoute)?.name || '';

  // Helper: look up station name by ID
  const getStationName = (stationId) => {
    const s = stations.find(st => st.stationId === stationId);
    return s ? `${s.stationName.toUpperCase()} — ${s.city}, ${s.state}` : `Station #${stationId}`;
  };

  const formatTime = (ts) => ts
    ? new Date(ts).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
    : '—';

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem' }}>Train Schedule</h2>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem', alignItems: 'flex-end' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '0.8rem', color: '#555' }}>ROUTE</label>
          <select value={selectedRoute} onChange={e => setSelectedRoute(e.target.value)} style={selectStyle}>
            <option value="">Select a route</option>
            {routes.map(r => (
              <option key={r.routeId} value={r.routeId}>{r.name}</option>
            ))}
          </select>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '0.8rem', color: '#555' }}>DATE</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} style={selectStyle} />
        </div>
        <button onClick={handleSearch} style={btnStyle}>View Schedule</button>
      </div>

      {/* Results */}
      {!searched ? (
        <div style={emptyBox}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🗓️</div>
          <p>Select a route and date to view the schedule</p>
        </div>
      ) : loading ? (
        <p style={{ color: '#888' }}>Loading schedule...</p>
      ) : schedules.length === 0 ? (
        <div style={emptyBox}>
          <p>No schedule found for <strong>{routeName}</strong> on <strong>{date}</strong>.</p>
        </div>
      ) : (
        <>
          <p style={{ color: '#555', marginBottom: '1rem' }}>
            <strong>{routeName}</strong> — {schedules.length} stops on <strong>{date}</strong>
          </p>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#1a1a2e', color: '#fff' }}>
                {['Stop', 'Station', 'Arrival', 'Departure'].map(h => (
                  <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {schedules.map((s, i) => (
                <tr key={s.scheduleId} style={{ background: i % 2 === 0 ? '#f9f9f9' : '#fff', borderBottom: '1px solid #eee' }}>
                  <td style={tdStyle}>
                    <span style={{
                      background: '#1a1a2e', color: '#fff',
                      borderRadius: '50%', width: '28px', height: '28px',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.8rem', fontWeight: 'bold'
                    }}>
                      {s.stopSequence}
                    </span>
                  </td>
                  <td style={tdStyle}>{getStationName(s.stationId)}</td>
                  <td style={tdStyle}>{formatTime(s.arrivalTime)}</td>
                  <td style={tdStyle}>{formatTime(s.departureTime)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

const selectStyle = { padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', minWidth: '220px' };
const tdStyle = { padding: '0.75rem 1rem' };
const btnStyle = { padding: '0.6rem 1.5rem', background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer' };
const emptyBox = { textAlign: 'center', padding: '3rem', color: '#aaa', border: '2px dashed #ddd', borderRadius: '12px' };