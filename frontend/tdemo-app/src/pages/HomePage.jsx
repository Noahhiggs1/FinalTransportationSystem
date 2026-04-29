import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [stations, setStations] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [showFrom, setShowFrom] = useState(false);
  const [showTo, setShowTo] = useState(false);
  const fromRef = useRef(null);
  const toRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8081/api/stations')
      .then(r => r.json())
      .then(data => setStations(Array.isArray(data) ? data : []))
      .catch(() => {});

    fetch('http://localhost:8081/api/routes')
      .then(r => r.json())
      .then(data => setRoutes(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const close = (e) => {
      if (fromRef.current && !fromRef.current.contains(e.target)) setShowFrom(false);
      if (toRef.current && !toRef.current.contains(e.target)) setShowTo(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const filterStations = (value) =>
    stations.filter(s =>
      s.city.toLowerCase().includes(value.toLowerCase()) ||
      s.stationName.toLowerCase().includes(value.toLowerCase()) ||
      s.state.toLowerCase().includes(value.toLowerCase())
    ).slice(0, 8);

  const handleFromChange = (val) => {
    setFrom(val);
    setFromSuggestions(filterStations(val));
    setShowFrom(val.length > 0);
  };

  const handleToChange = (val) => {
    setTo(val);
    setToSuggestions(filterStations(val));
    setShowTo(val.length > 0);
  };

  const handleSearch = () => {
    if (!from || !to || !date) {
      alert('Please fill in all fields');
      return;
    }
    navigate(`/booking?from=${from}&to=${to}&date=${date}`);
  };

  const Dropdown = ({ suggestions, onSelect }) => (
    <div style={{
      position: 'absolute',
      top: 'calc(100% + 4px)',
      left: 0,
      right: 0,
      background: '#fff',
      border: '1px solid #e0e0e0',
      borderRadius: '12px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
      zIndex: 999,
      overflow: 'hidden',
      maxHeight: '240px',
      overflowY: 'auto'
    }}>
      {suggestions.length === 0 ? (
        <div style={{ padding: '1rem', color: '#aaa', fontSize: '0.9rem' }}>
          No stations found
        </div>
      ) : suggestions.map(s => (
        <div
          key={s.stationId}
          onClick={() => onSelect(s)}
          style={{
            padding: '0.75rem 1rem',
            cursor: 'pointer',
            borderBottom: '1px solid #f5f5f5',
            transition: 'background 0.15s',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#f8f9ff'}
          onMouseLeave={e => e.currentTarget.style.background = '#fff'}
        >
          <span style={{ fontSize: '1.2rem' }}>📍</span>
          <div>
            <div style={{
              fontWeight: '600',
              fontSize: '0.9rem',
              color: '#1a1a2e'
            }}>
              {s.city}, {s.state}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#888' }}>
              {s.stationName}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>

      <div style={{
        background: 'linear-gradient(160deg, #0d1b3e 0%, #1a3a6e 50%, #0d1b3e 100%)',
        padding: '4rem 2rem',
        textAlign: 'center',
        color: '#fff',
        marginBottom: '3rem',
        borderRadius: '16px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.03) 0%, transparent 60%)',
          pointerEvents: 'none'
        }} />

        <p style={{
          fontSize: '0.85rem',
          letterSpacing: '3px',
          color: '#90b4e8',
          textTransform: 'uppercase',
          marginBottom: '0.75rem'
        }}>
          National Transportation Booking
        </p>
        <h1 style={{
          fontSize: '2.8rem',
          fontWeight: '700',
          marginBottom: '0.5rem',
          letterSpacing: '-0.5px'
        }}>
          Where are you headed?
        </h1>
        <p style={{ color: '#90b4e8', marginBottom: '2.5rem', fontSize: '1rem' }}>
          Search routes, compare times, and book your seat in seconds
        </p>

        <div style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '1.5rem',
          maxWidth: '820px',
          margin: '0 auto',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr auto',
            gap: '1rem',
            alignItems: 'end'
          }}>

            <div ref={fromRef} style={{ position: 'relative' }}>
              <label style={labelStyle}>FROM</label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute', left: '12px',
                  top: '50%', transform: 'translateY(-50%)',
                  fontSize: '1rem', pointerEvents: 'none'
                }}>🚉</span>
                <input
                  placeholder="City or station"
                  value={from}
                  onChange={e => handleFromChange(e.target.value)}
                  onFocus={() => from.length > 0 && setShowFrom(true)}
                  autoComplete="off"
                  style={{ ...searchInput, paddingLeft: '38px' }}
                />
              </div>
              {showFrom && fromSuggestions.length > 0 && (
                <Dropdown
                  suggestions={fromSuggestions}
                  onSelect={s => { setFrom(s.city); setShowFrom(false); }}
                />
              )}
            </div>

            <div ref={toRef} style={{ position: 'relative' }}>
              <label style={labelStyle}>TO</label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute', left: '12px',
                  top: '50%', transform: 'translateY(-50%)',
                  fontSize: '1rem', pointerEvents: 'none'
                }}>🏁</span>
                <input
                  placeholder="City or station"
                  value={to}
                  onChange={e => handleToChange(e.target.value)}
                  onFocus={() => to.length > 0 && setShowTo(true)}
                  autoComplete="off"
                  style={{ ...searchInput, paddingLeft: '38px' }}
                />
              </div>
              {showTo && toSuggestions.length > 0 && (
                <Dropdown
                  suggestions={toSuggestions}
                  onSelect={s => { setTo(s.city); setShowTo(false); }}
                />
              )}
            </div>

            <div>
              <label style={labelStyle}>DEPARTURE DATE</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                style={searchInput}
              />
            </div>

            <button onClick={handleSearch} style={{
              padding: '0.75rem 1.75rem',
              background: 'linear-gradient(135deg, #1a3a6e, #0d1b3e)',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              fontSize: '0.95rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              letterSpacing: '0.5px'
            }}>
              Find Trains
            </button>
          </div>
        </div>
      </div>

      {routes.length > 0 && (
        <div style={{ marginBottom: '3rem' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.25rem'
          }}>
            <h2 style={{ margin: 0, fontSize: '1.3rem', color: '#1a1a2e' }}>
              Available Routes
            </h2>
            <span style={{ color: '#888', fontSize: '0.85rem' }}>
              {routes.length} routes available
            </span>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1rem'
          }}>
            {routes.map(route => (
              <div
                key={route.routeId}
                onClick={() => navigate('/booking')}
                style={{
                  padding: '1.25rem 1.5rem',
                  background: '#fff',
                  border: '1px solid #e8eaf0',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.1)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div>
                  <div style={{
                    fontWeight: '600',
                    color: '#1a1a2e',
                    fontSize: '0.95rem',
                    marginBottom: '4px'
                  }}>
                    🚆 {route.name}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#888' }}>
                    Click to view trains
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  gap: '4px'
                }}>
                  <span style={{
                    padding: '3px 10px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    background: route.status === 'active' ? '#e8f5e9' : '#fff3e0',
                    color: route.status === 'active' ? '#2e7d32' : '#e65100'
                  }}>
                    {route.status === 'active' ? '● Active' : '● ' + route.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2rem'
      }}>
        {[
          {
            icon: '🗓️',
            title: 'Flexible Scheduling',
            desc: 'Browse departure times for any route and date. Plan your trip your way.'
          },
          {
            icon: '💺',
            title: 'Choose Your Seat',
            desc: 'Pick the exact seat you want. Window, middle, or aisle — your choice.'
          },
          {
            icon: '💳',
            title: 'Easy Payments',
            desc: 'Pay securely with PayPal or Stripe. We never store your card details.'
          },
          {
            icon: '🔔',
            title: 'Live Delay Alerts',
            desc: 'Get notified instantly about delays or service changes on your route.'
          },
        ].map(card => (
          <div key={card.title} style={{
            background: '#fff',
            borderRadius: '14px',
            padding: '1.5rem',
            border: '1px solid #e8eaf0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>
              {card.icon}
            </div>
            <h3 style={{
              margin: '0 0 0.5rem',
              fontSize: '1rem',
              fontWeight: '600',
              color: '#1a1a2e'
            }}>
              {card.title}
            </h3>
            <p style={{ color: '#777', margin: 0, fontSize: '0.875rem', lineHeight: '1.6' }}>
              {card.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

const labelStyle = {
  display: 'block',
  fontSize: '0.72rem',
  fontWeight: '700',
  color: '#888',
  letterSpacing: '1px',
  marginBottom: '6px',
  textTransform: 'uppercase'
};

const searchInput = {
  width: '100%',
  padding: '0.7rem 0.9rem',
  borderRadius: '10px',
  border: '1.5px solid #e0e0e0',
  fontSize: '0.95rem',
  outline: 'none',
  boxSizing: 'border-box',
  color: '#1a1a2e',
  transition: 'border-color 0.2s'
};