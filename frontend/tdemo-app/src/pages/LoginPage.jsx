import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function LoginPage() {
  // Track which tab the user is on - customer or employee
  const [activeTab, setActiveTab] = useState('customer');
  const [isRegistering, setIsRegistering] = useState(false);

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  // Registration form state - only for customers
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');

  const navigate = useNavigate();

  // Handle login for both customers and employees
  const handleLogin = () => {
    if (!email || !password) {
      setIsError(true);
      setMessage('Please enter both email and password.');
      return;
    }
    setLoading(true);
    setMessage('');

    fetch('http://localhost:8081/api/users/validate?inputPassword=' 
      + encodeURIComponent(password), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
      .then(res => res.text())
      .then(text => {
        if (text === 'Login successful') {
          // Fetch the full user object so we know their role
          return fetch(`http://localhost:8081/api/users/email/${encodeURIComponent(email)}`)
            .then(res => res.json())
            .then(user => {
              // Save user info to sessionStorage
              // sessionStorage keeps data until the browser tab is closed
              sessionStorage.setItem('isLoggedIn', 'true');
              sessionStorage.setItem('userEmail', user.email);
              sessionStorage.setItem('userId', user.userId);
              sessionStorage.setItem('userRole', user.role || 'customer');
              sessionStorage.setItem('userName', user.firstName + ' ' + user.lastName);

              setIsError(false);
              setMessage('✅ Login successful! Redirecting...');

              // Redirect based on role
              setTimeout(() => {
                if (user.role === 'admin') navigate('/admin');
                else if (user.role === 'operator') navigate('/operator');
                else navigate('/dashboard');
              }, 1000);
            });
        } else {
          setIsError(true);
          setMessage('❌ ' + text);
        }
      })
      .catch(() => {
        setIsError(true);
        setMessage('❌ Could not reach server. Is Spring Boot running on port 8081?');
      })
      .finally(() => setLoading(false));
  };

  // Handle new customer registration
  const handleRegister = () => {
    if (!regFirstName || !regLastName || !regEmail || !regPassword || !regUsername) {
      setIsError(true);
      setMessage('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    setMessage('');

    fetch('http://localhost:8081/api/users/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: regFirstName,
        lastName: regLastName,
        email: regEmail,
        username: regUsername,
        password: regPassword,
        telephone: regPhone,
        role: 'customer'
      })
    })
      .then(res => {
        if (!res.ok) throw new Error('Registration failed');
        return res.json();
      })
      .then(() => {
        setIsError(false);
        setMessage('✅ Account created! You can now log in.');
        setIsRegistering(false);
        // Pre-fill the email so they can log in immediately
        setEmail(regEmail);
      })
      .catch(() => {
        setIsError(true);
        setMessage('❌ Registration failed. Email may already be in use.');
      })
      .finally(() => setLoading(false));
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '480px',
      }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '3rem' }}>🚆</div>
          <h1 style={{ color: '#fff', margin: '0.5rem 0 0', fontSize: '1.8rem' }}>
            TranzitSystem
          </h1>
          <p style={{ color: '#9090b0', margin: '0.25rem 0 0', fontSize: '0.9rem' }}>
            National Transportation Booking
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '20px',
          padding: '2rem',
        }}>

          {/* Tab switcher — Customer vs Employee */}
          {!isRegistering && (
            <div style={{
              display: 'flex',
              background: 'rgba(0,0,0,0.3)',
              borderRadius: '10px',
              padding: '4px',
              marginBottom: '1.5rem'
            }}>
              {['customer', 'employee'].map(tab => (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); setMessage(''); }}
                  style={{
                    flex: 1,
                    padding: '0.6rem',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: activeTab === tab ? 'bold' : 'normal',
                    background: activeTab === tab
                      ? 'linear-gradient(135deg, #667eea, #764ba2)'
                      : 'transparent',
                    color: '#fff',
                    transition: 'all 0.2s'
                  }}
                >
                  {tab === 'customer' ? '👤 Customer' : '🏢 Employee'}
                </button>
              ))}
            </div>
          )}

          {/* Registration form */}
          {isRegistering ? (
            <div>
              <h3 style={{ color: '#fff', marginBottom: '1.5rem', textAlign: 'center' }}>
                Create Account
              </h3>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>First Name *</label>
                  <input
                    placeholder="First name"
                    value={regFirstName}
                    onChange={e => setRegFirstName(e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Last Name *</label>
                  <input
                    placeholder="Last name"
                    value={regLastName}
                    onChange={e => setRegLastName(e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={labelStyle}>Email *</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={regEmail}
                  onChange={e => setRegEmail(e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={labelStyle}>Username *</label>
                <input
                  placeholder="Choose a username"
                  value={regUsername}
                  onChange={e => setRegUsername(e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={labelStyle}>Phone</label>
                <input
                  placeholder="Phone number"
                  value={regPhone}
                  onChange={e => setRegPhone(e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={labelStyle}>Password *</label>
                <input
                  type="password"
                  placeholder="Choose a password"
                  value={regPassword}
                  onChange={e => setRegPassword(e.target.value)}
                  style={inputStyle}
                />
              </div>

              {message && (
                <div style={message.includes('✅') ? successBox : errorBox}>
                  {message}
                </div>
              )}

              <button
                onClick={handleRegister}
                disabled={loading}
                style={primaryBtn}
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>

              <button
                onClick={() => { setIsRegistering(false); setMessage(''); }}
                style={ghostBtn}
              >
                Back to Login
              </button>
            </div>

          ) : (
            // Login form
            <div>
              <h3 style={{ color: '#fff', marginBottom: '1.5rem', textAlign: 'center' }}>
                {activeTab === 'customer' ? 'Sign In to Your Account' : 'Employee Sign In'}
              </h3>

              <div style={{ marginBottom: '1rem' }}>
                <label style={labelStyle}>Email</label>
                <input
                  type="email"
                  placeholder={activeTab === 'customer'
                    ? 'your@email.com'
                    : 'employee@tranzit.com'}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={labelStyle}>Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  style={inputStyle}
                />
              </div>

              {message && (
                <div style={message.includes('✅') ? successBox : errorBox}>
                  {message}
                </div>
              )}

              <button
                onClick={handleLogin}
                disabled={loading}
                style={primaryBtn}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>

              {/* Guest option - only for customers */}
              {activeTab === 'customer' && (
                <Link to="/booking" style={{ textDecoration: 'none' }}>
                  <button style={ghostBtn}>

                  </button>
                </Link>
              )}

              {/* Create account - only for customers */}
              {activeTab === 'customer' && (
                <p style={{ textAlign: 'center', color: '#9090b0', fontSize: '0.85rem', marginTop: '1rem' }}>
                  Don't have an account?{' '}
                  <span
                    onClick={() => { setIsRegistering(true); setMessage(''); }}
                    style={{ color: '#a78bfa', cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    Create one
                  </span>
                </p>
              )}

              {/* Test credentials hint */}
              <div style={{
                marginTop: '1.5rem',
                padding: '0.75rem',
                background: 'rgba(0,0,0,0.3)',
                borderRadius: '8px',
                fontSize: '0.78rem',
                color: '#6060a0'
              }}>
                <strong style={{ color: '#9090b0' }}>Test login:</strong><br />
                Email: chris.brown@email.com<br />
                Password: ChristIsKing444
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const labelStyle = {
  display: 'block',
  fontSize: '0.82rem',
  color: '#9090b0',
  marginBottom: '4px',
  fontWeight: '500'
};

const inputStyle = {
  width: '100%',
  padding: '0.7rem 0.9rem',
  borderRadius: '10px',
  border: '1px solid rgba(255,255,255,0.1)',
  background: 'rgba(255,255,255,0.07)',
  color: '#fff',
  fontSize: '0.95rem',
  boxSizing: 'border-box',
  outline: 'none'
};

const primaryBtn = {
  width: '100%',
  padding: '0.85rem',
  background: 'linear-gradient(135deg, #667eea, #764ba2)',
  color: '#fff',
  border: 'none',
  borderRadius: '10px',
  fontSize: '1rem',
  fontWeight: 'bold',
  cursor: 'pointer',
  marginBottom: '0.75rem',
  transition: 'opacity 0.2s'
};

const ghostBtn = {
  width: '100%',
  padding: '0.75rem',
  background: 'transparent',
  color: '#9090b0',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '10px',
  fontSize: '0.9rem',
  cursor: 'pointer',
  marginBottom: '0.5rem'
};

const successBox = {
  padding: '0.75rem 1rem',
  borderRadius: '8px',
  background: 'rgba(74,222,128,0.1)',
  border: '1px solid rgba(74,222,128,0.3)',
  color: '#4ade80',
  fontSize: '0.9rem',
  marginBottom: '1rem'
};

const errorBox = {
  padding: '0.75rem 1rem',
  borderRadius: '8px',
  background: 'rgba(248,113,113,0.1)',
  border: '1px solid rgba(248,113,113,0.3)',
  color: '#f87171',
  fontSize: '0.9rem',
  marginBottom: '1rem'
};