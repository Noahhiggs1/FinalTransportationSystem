import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!email || !password) {
      setIsError(true);
      setMessage('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setMessage('');

    // First find the user by email, then validate password
    fetch('http://localhost:8081/api/users/validate?inputPassword=' + encodeURIComponent(password), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
      .then(res => res.text())
      .then(text => {
        if (text === 'Login successful') {
          setIsError(false);
          setMessage('✅ Login successful! Redirecting...');
          // Save user info to sessionStorage so other pages know they are logged in
          sessionStorage.setItem('userEmail', email);
          sessionStorage.setItem('isLoggedIn', 'true');
          // Redirect to home after 1 second
          setTimeout(() => navigate('/'), 1000);
        } else {
          setIsError(true);
          setMessage('❌ ' + text);
        }
      })
      .catch(() => {
        setIsError(true);
        setMessage('❌ Could not reach server. Is the backend running on port 8081?');
      })
      .finally(() => setLoading(false));
  };

  return (
    <div style={{ maxWidth: '440px', margin: '3rem auto' }}>
      <div style={{
        background: '#fff',
        border: '1px solid #eee',
        borderRadius: '16px',
        padding: '2.5rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🚆</div>
          <h2 style={{ margin: '0 0 0.25rem' }}>Welcome Back</h2>
          <p style={{ color: '#888', margin: 0, fontSize: '0.9rem' }}>
            Sign in to access your wallet and tickets
          </p>
        </div>

        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              style={inputStyle}
            />
          </div>

          <div>
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

          {/* Message box */}
          {message && (
            <div style={{
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              background: isError ? '#ffebee' : '#e8f5e9',
              color: isError ? '#c62828' : '#2e7d32',
              fontSize: '0.9rem',
              border: `1px solid ${isError ? '#ffcdd2' : '#c8e6c9'}`
            }}>
              {message}
            </div>
          )}

          {/* Login button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            style={{
              padding: '0.8rem',
              background: loading ? '#666' : '#1a1a2e',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '0.5rem',
              transition: 'background 0.2s'
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </div>

        {/* Test credentials hint */}
        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          background: '#f5f5f5',
          borderRadius: '8px',
          fontSize: '0.82rem',
          color: '#666'
        }}>
          <strong>Test credentials from your database:</strong>
          <br />
          Email: <code>chris.brown@email.com</code>
          <br />
          Password: <code>ChristIsKing444</code>
        </div>

        <p style={{
          textAlign: 'center',
          color: '#aaa',
          fontSize: '0.82rem',
          marginTop: '1.5rem'
        }}>
          Wallet · Refunds · Reports available after login
        </p>
      </div>
    </div>
  );
}

const labelStyle = {
  display: 'block',
  fontSize: '0.85rem',
  color: '#555',
  marginBottom: '4px',
  fontWeight: '500'
};

const inputStyle = {
  width: '100%',
  padding: '0.7rem 0.9rem',
  borderRadius: '8px',
  border: '1px solid #ddd',
  fontSize: '1rem',
  boxSizing: 'border-box',
  outline: 'none',
  transition: 'border 0.2s'
};