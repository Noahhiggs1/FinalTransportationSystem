import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
  const userName = sessionStorage.getItem('userName') || '';
  const userRole = sessionStorage.getItem('userRole') || '';

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login');
  };

  const tabs = [
    { label: '🏠 Home', path: '/' },
    { label: '🚆 Book a Train', path: '/booking' },
    { label: '🗓️ Schedule', path: '/schedule' },
  ];

  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '1rem 2rem',
      background: '#1a1a2e',
      boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
      flexWrap: 'wrap'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginRight: '2rem'
      }}>
        <span style={{ fontSize: '1.8rem' }}>🚆</span>
        <div>
          <div style={{
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            lineHeight: 1
          }}>
            TranzitSystem
          </div>
          <div style={{ color: '#7a8fb5', fontSize: '0.7rem' }}>
            National Transportation Booking
          </div>
        </div>
      </div>

      {tabs.map(tab => {
        const isActive = location.pathname === tab.path;
        return (
          <Link
            key={tab.path}
            to={tab.path}
            style={{
              padding: '0.5rem 1.1rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: isActive ? 'bold' : 'normal',
              color: isActive ? '#1a1a2e' : '#cce0ff',
              background: isActive ? '#ffffff' : 'transparent',
              border: '1px solid transparent',
              transition: 'all 0.2s',
            }}
          >
            {tab.label}
          </Link>
        );
      })}

      {/* Show My Account link when logged in */}
      {isLoggedIn && (
        <Link
          to="/dashboard"
          style={{
            padding: '0.5rem 1.1rem',
            borderRadius: '8px',
            textDecoration: 'none',
            fontSize: '0.9rem',
            fontWeight: location.pathname === '/dashboard' ? 'bold' : 'normal',
            color: location.pathname === '/dashboard' ? '#1a1a2e' : '#cce0ff',
            background: location.pathname === '/dashboard' ? '#ffffff' : 'transparent',
            border: '1px solid transparent',
          }}
        >
          👤 My Account
        </Link>
      )}

      <div style={{
        marginLeft: 'auto',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
      }}>
        {isLoggedIn ? (
          <>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 'bold' }}>
                {userName}
              </div>
              <div style={{ color: '#7a8fb5', fontSize: '0.72rem' }}>
                {userRole}
              </div>
            </div>
            <button
              onClick={handleLogout}
              style={{
                padding: '0.4rem 1rem',
                background: 'transparent',
                border: '1px solid #7a8fb5',
                borderRadius: '6px',
                color: '#cce0ff',
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            style={{
              padding: '0.5rem 1.1rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '0.9rem',
              color: location.pathname === '/login' ? '#1a1a2e' : '#cce0ff',
              background: location.pathname === '/login' ? '#ffffff' : 'transparent',
              border: '1px solid transparent'
            }}
          >
            🔐 Login
          </Link>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#4caf50',
            display: 'inline-block'
          }} />
          <span style={{ color: '#7a8fb5', fontSize: '0.8rem' }}>Online</span>
        </div>
      </div>
    </nav>
  );
}