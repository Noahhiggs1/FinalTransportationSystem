import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function HomePage() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [routes, setRoutes] = useState([]);
  const [loadingRoutes, setLoadingRoutes] = useState(true);
  const navigate = useNavigate();

  // Load real routes from PostgreSQL on page load
  useEffect(() => {
    api.get('/routes')
      .then(data => setRoutes(data))
      .catch(err => console.error('Could not load routes:', err))
      .finally(() => setLoadingRoutes(false));
  }, []);

  const handleSearch = () => {
    if (!from || !to || !date) return alert('Please fill in all fields');
    navigate(`/booking?from=${from}&to=${to}&date=${date}`);
  };

  return (
    <div>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
        borderRadius: '16px',
        padding: '3rem',
        textAlign: 'center',
        marginBottom: '2rem',
        color: '#fff'
      }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Travel Smarter</h1>
        <p style={{ color: '#aaa', marginBottom: '2rem' }}>
          Book train tickets across the nation in seconds
        </p>

        {/* Search form */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap',
          background: '#fff',
          borderRadius: '12px',
          padding: '1.5rem',
          maxWidth: '700px',
          margin: '0 auto'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: '150px' }}>
            <label style={{ color: '#555', fontSize: '0.8rem', marginBottom: '4px' }}>FROM</label>
            <input
              placeholder="City or station"
              value={from}
              onChange={e => setFrom(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: '150px' }}>
            <label style={{ color: '#555', fontSize: '0.8rem', marginBottom: '4px' }}>TO</label>
            <input
              placeholder="City or station"
              value={to}
              onChange={e => setTo(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: '150px' }}>
            <label style={{ color: '#555', fontSize: '0.8rem', marginBottom: '4px' }}>DATE</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              style={inputStyle}
            />
          </div>
          <button onClick={handleSearch} style={btnStyle}>Find Rides</button>
        </div>
      </div>

      {/* Live routes from PostgreSQL */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Available Routes</h3>
        {loadingRoutes ? (
          <p style={{ color: '#888' }}>Loading routes...</p>
        ) : routes.length === 0 ? (
          <p style={{ color: '#888' }}>No routes found in database.</p>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {routes.map(route => (
              <div key={route.routeId} style={{
                padding: '0.6rem 1.2rem',
                background: route.status === 'ACTIVE' ? '#e8f5e9' : '#fff3e0',
                border: `1px solid ${route.status === 'ACTIVE' ? '#a5d6a7' : '#ffcc80'}`,
                borderRadius: '20px',
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
                onClick={() => setFrom(route.name.split('→')[0]?.trim())}
              >
                {route.name}
                <span style={{
                  marginLeft: '8px',
                  fontSize: '0.75rem',
                  color: route.status === 'ACTIVE' ? '#2e7d32' : '#e65100'
                }}>
                  {route.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Feature cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        {[
          { icon: '🗓️', title: 'Easy Scheduling', desc: 'Browse departure times for any route and date' },
          { icon: '💺', title: 'Pick Your Seat', desc: 'Choose the exact seat you want before you book' },
          { icon: '💳', title: 'Wallet & Refunds', desc: 'Manage payments and request refunds in one place' },
          { icon: '📍', title: 'Live Updates', desc: 'Get notified about delays and service changes' },
        ].map(card => (
          <div key={card.title} style={{
            background: '#f9f9f9',
            borderRadius: '12px',
            padding: '1.5rem',
            border: '1px solid #eee'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{card.icon}</div>
            <h3 style={{ margin: '0 0 0.5rem' }}>{card.title}</h3>
            <p style={{ color: '#777', margin: 0, fontSize: '0.9rem' }}>{card.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const inputStyle = {
  padding: '0.6rem 0.8rem', borderRadius: '8px',
  border: '1px solid #ddd', fontSize: '1rem', outline: 'none', width: '100%'
};
const btnStyle = {
  padding: '0.6rem 1.5rem', background: '#1a1a2e', color: '#fff',
  border: 'none', borderRadius: '8px', fontSize: '1rem',
  cursor: 'pointer', alignSelf: 'flex-end'
};