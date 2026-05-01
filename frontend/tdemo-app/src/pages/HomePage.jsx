import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

// Reusable autocomplete input component
function StationInput({ label, value, onChange, stations }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Filter stations based on what the user typed
  const suggestions = value.length > 0
    ? stations.filter(s =>
        s.stationName.toLowerCase().includes(value.toLowerCase()) ||
        s.city.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 6) // limit to 6 suggestions
    : [];

  // Close dropdown when user clicks outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      ref={wrapperRef}
      style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: '150px', position: 'relative' }}
    >
      <label style={{ color: '#555', fontSize: '0.8rem', marginBottom: '4px' }}>{label}</label>
      <input
        placeholder="City or station"
        value={value}
        onChange={e => {
          onChange(e.target.value);
          setOpen(true); // open dropdown on typing
        }}
        onFocus={() => setOpen(true)}
        style={inputStyle}
        autoComplete="off"
      />

      {/* Suggestions dropdown */}
      {open && suggestions.length > 0 && (
        <ul style={dropdownStyle}>
          {suggestions.map(s => (
            <li
              key={s.stationId}
              onMouseDown={() => {        // onMouseDown fires before onBlur
                onChange(s.stationName);  // fill input with chosen station
                setOpen(false);
              }}
              style={suggestionStyle}
              onMouseEnter={e => e.currentTarget.style.background = '#f0f4ff'}
              onMouseLeave={e => e.currentTarget.style.background = '#fff'}
            >
              <strong>{s.stationName}</strong>
              <span style={{ color: '#888', fontSize: '0.8rem', marginLeft: '6px' }}>
                {s.city}, {s.state}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function HomePage() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [routes, setRoutes] = useState([]);
  const [stations, setStations] = useState([]);   // NEW
  const [loadingRoutes, setLoadingRoutes] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/routes')
      .then(data => setRoutes(data))
      .catch(err => console.error('Could not load routes:', err))
      .finally(() => setLoadingRoutes(false));

    // NEW: fetch stations for autocomplete
    api.get('/stations')
      .then(data => setStations(data))
      .catch(err => console.error('Could not load stations:', err));
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
          {/* REPLACED plain inputs with StationInput */}
          <StationInput label="FROM" value={from} onChange={setFrom} stations={stations} />
          <StationInput label="TO"   value={to}   onChange={setTo}   stations={stations} />

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

      {/* ... rest of your routes and feature cards stays the same ... */}
    </div>
  );
}

// --- Styles ---
const inputStyle = {
  padding: '0.6rem 0.8rem', borderRadius: '8px',
  border: '1px solid #ddd', fontSize: '1rem', outline: 'none', width: '100%'
};
const btnStyle = {
  padding: '0.6rem 1.5rem', background: '#1a1a2e', color: '#fff',
  border: 'none', borderRadius: '8px', fontSize: '1rem',
  cursor: 'pointer', alignSelf: 'flex-end'
};
const dropdownStyle = {
  position: 'absolute',
  top: '100%',
  left: 0,
  right: 0,
  background: '#fff',
  border: '1px solid #ddd',
  borderRadius: '8px',
  marginTop: '4px',
  listStyle: 'none',
  padding: 0,
  margin: '4px 0 0 0',
  zIndex: 999,
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
};
const suggestionStyle = {
  padding: '0.6rem 0.8rem',
  cursor: 'pointer',
  background: '#fff',
  borderBottom: '1px solid #f0f0f0',
  textAlign: 'left',
  transition: 'background 0.1s'
};
