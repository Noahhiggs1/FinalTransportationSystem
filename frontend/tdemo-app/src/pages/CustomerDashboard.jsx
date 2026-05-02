import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CustomerDashboard() {
  const navigate = useNavigate();

  // Get user info from sessionStorage - this was saved when they logged in
  const userId = sessionStorage.getItem('userId');
  const userName = sessionStorage.getItem('userName');
  const userEmail = sessionStorage.getItem('userEmail');
  const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
  const [delays, setDelays] = useState([]);

  // If not logged in redirect to login page
  useEffect(() => {
    if (!isLoggedIn) navigate('/login');
  }, [isLoggedIn, navigate]);

  // Tab state - which section is the user looking at
  const [activeTab, setActiveTab] = useState('overview');

  // Data from backend
  const [tickets, setTickets] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [refunds, setRefunds] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);

  // Refund form state
  const [refundTicketId, setRefundTicketId] = useState('');
  const [refundReason, setRefundReason] = useState('');
  const [refundMessage, setRefundMessage] = useState('');

  // Load all data when the page opens
  useEffect(() => {
    if (!userId) return;

    // Load tickets, notifications, refunds and routes all at once
    // Promise.all runs all fetches at the same time instead of one by one
    Promise.all([
      fetch(`http://localhost:8081/api/tickets/user/${userId}`).then(r => r.json()),
      fetch(`http://localhost:8081/api/notifications/user/${userId}`).then(r => r.json()),
      fetch(`http://localhost:8081/api/refunds/user/${userId}`).then(r => r.json()),
      fetch('http://localhost:8081/api/routes').then(r => r.json()),
      fetch('http://localhost:8081/api/delays/active').then(r => r.json()),
    ])
      .then(([ticketsData, notifData, refundData, routesData, delayData]) => {
        setTickets(Array.isArray(ticketsData) ? ticketsData : []);
        setNotifications(Array.isArray(notifData) ? notifData : []);
        setRefunds(Array.isArray(refundData) ? refundData : []);
        setRoutes(Array.isArray(routesData) ? routesData : []);
        setDelays(Array.isArray(delayData) ? delayData : []);
      })
      .catch(err => console.error('Error loading dashboard data:', err))
      .finally(() => setLoading(false));
  }, [userId]);

  // Count unread notifications for the badge
  const unreadCount = notifications.filter(n => !n.read).length;

  // Mark a notification as read when clicked
  const markAsRead = (notifId) => {
    fetch(`http://localhost:8081/api/notifications/${notifId}/read`, {
      method: 'PUT'
    }).then(() => {
      setNotifications(prev =>
        prev.map(n => n.notificationId === notifId ? { ...n, read: true } : n)
      );
    });
  };

  // Submit a refund request
  const handleRefundSubmit = () => {
    if (!refundTicketId || !refundReason) {
      setRefundMessage('Please enter a ticket ID and reason.');
      return;
    }

    fetch('http://localhost:8081/api/refunds/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ticketId: parseInt(refundTicketId),
        userId: parseInt(userId),
        reason: refundReason,
        status: 'PENDING'
      })
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed');
        return res.json();
      })
      .then(newRefund => {
        setRefunds(prev => [newRefund, ...prev]);
        setRefundMessage('✅ Refund request submitted successfully.');
        setRefundTicketId('');
        setRefundReason('');
      })
      .catch(() => setRefundMessage('❌ Could not submit refund. Check your ticket ID.'));
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '🏠' },
    { id: 'tickets', label: 'My Tickets', icon: '🎫' },
    { id: 'refunds', label: 'Refunds', icon: '💳' },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: '🔔',
      badge: unreadCount
    },
  ];

  if (loading) {
    return (
      <div style={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center', color: '#666' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

      {delays.length > 0 && (
        <div style={{ background: '#fff3e0', border: '1px solid #ffcc80', borderRadius: '10px', padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ fontWeight: 'bold', color: '#e65100', marginBottom: '0.5rem' }}>⚠️ Active Service Alerts ({delays.length})</div>
          {delays.map(d => (
            <div key={d.id} style={{ padding: '0.5rem 0', borderBottom: '1px solid #ffe0b2', fontSize: '0.9rem', color: '#bf360c' }}>
              <strong>{d.severity}</strong> — {d.message || d.type}
              {d.estimatedDelayMinutes && <span style={{ marginLeft: '0.5rem', color: '#e65100' }}>~{d.estimatedDelayMinutes} min delay</span>}
              {d.affectedLines?.length > 0 && <span style={{ marginLeft: '0.5rem', color: '#999' }}>({d.affectedLines.join(', ')})</span>}
            </div>
          ))}
        </div>
      )}

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
        borderRadius: '16px',
        padding: '2rem',
        marginBottom: '1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h2 style={{ color: '#fff', margin: 0, fontSize: '1.5rem' }}>
            Welcome back, {userName?.split(' ')[0]} 👋
          </h2>
          <p style={{ color: '#7a8fb5', margin: '0.25rem 0 0', fontSize: '0.9rem' }}>
            {userEmail}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => navigate('/booking')}
            style={{
              padding: '0.6rem 1.2rem',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '0.9rem'
            }}
          >
            🚆 Book a Train
          </button>
          <button
            onClick={() => {
              sessionStorage.clear();
              navigate('/login');
            }}
            style={{
              padding: '0.6rem 1.2rem',
              background: 'transparent',
              color: '#7a8fb5',
              border: '1px solid #7a8fb5',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Quick stats row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        {[
          { label: 'Total Tickets', value: tickets.length, icon: '🎫', color: '#667eea' },
          { label: 'Active Tickets', value: tickets.filter(t => t.bookingStatus === 'CONFIRMED').length, icon: '✅', color: '#4ade80' },
          { label: 'Pending Refunds', value: refunds.filter(r => r.status === 'PENDING').length, icon: '💳', color: '#f59e0b' },
          { label: 'Notifications', value: unreadCount, icon: '🔔', color: '#f87171' },
        ].map(stat => (
          <div key={stat.label} style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '1.25rem',
            border: '1px solid #eee',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{stat.icon}</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: stat.color }}>
              {stat.value}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.25rem' }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Tab navigation */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '1.5rem',
        background: '#f5f5f5',
        padding: '4px',
        borderRadius: '12px'
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              padding: '0.6rem 0.5rem',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: activeTab === tab.id ? 'bold' : 'normal',
              background: activeTab === tab.id ? '#fff' : 'transparent',
              color: activeTab === tab.id ? '#1a1a2e' : '#888',
              boxShadow: activeTab === tab.id ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.2s',
              position: 'relative'
            }}
          >
            {tab.icon} {tab.label}
            {tab.badge > 0 && (
              <span style={{
                marginLeft: '4px',
                background: '#f87171',
                color: '#fff',
                borderRadius: '10px',
                padding: '1px 6px',
                fontSize: '0.7rem',
                fontWeight: 'bold'
              }}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{
        background: '#fff',
        borderRadius: '16px',
        padding: '1.5rem',
        border: '1px solid #eee',
        minHeight: '300px'
      }}>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div>
            <h3 style={{ marginTop: 0 }}>Train Status</h3>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>
              Current status of all active routes
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {routes.length === 0 ? (
                <p style={{ color: '#aaa' }}>No routes available.</p>
              ) : (
                routes.map(route => (
                  <div key={route.routeId} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1rem 1.25rem',
                    background: '#f9f9f9',
                    borderRadius: '10px',
                    border: '1px solid #eee'
                  }}>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{route.name}</div>
                      <div style={{ color: '#888', fontSize: '0.85rem' }}>
                        Route #{route.routeId}
                      </div>
                    </div>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      background: route.status === 'active' ? '#e8f5e9' : '#fff3e0',
                      color: route.status === 'active' ? '#2e7d32' : '#e65100'
                    }}>
                      {route.status === 'active' ? '✅ On Time' : '⚠️ ' + route.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TICKETS TAB */}
        {activeTab === 'tickets' && (
          <div>
            <h3 style={{ marginTop: 0 }}>My Tickets</h3>
            {tickets.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#aaa' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎫</div>
                <p>No tickets yet.</p>
                <button
                  onClick={() => navigate('/booking')}
                  style={{
                    padding: '0.6rem 1.4rem',
                    background: '#1a1a2e',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  Book Your First Train
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {tickets.map(ticket => (
                  <div key={ticket.ticketId} style={{
                    padding: '1.25rem',
                    border: '1px solid #eee',
                    borderRadius: '12px',
                    background: '#f9f9f9'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '0.5rem'
                    }}>
                      <div>
                        <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                          Ticket #{ticket.ticketId}
                        </div>
                        <div style={{ color: '#666', fontSize: '0.9rem' }}>
                          Seat: {ticket.seatNumber || 'N/A'}
                        </div>
                        <div style={{ color: '#666', fontSize: '0.9rem' }}>
                          Departure: {ticket.departureTime
                            ? new Date(ticket.departureTime).toLocaleString()
                            : 'TBD'}
                        </div>
                      </div>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        alignSelf: 'flex-start',
                        background: ticket.bookingStatus === 'CONFIRMED'
                          ? '#e8f5e9' : '#fff3e0',
                        color: ticket.bookingStatus === 'CONFIRMED'
                          ? '#2e7d32' : '#e65100'
                      }}>
                        {ticket.bookingStatus || 'PENDING'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* REFUNDS TAB */}
        {activeTab === 'refunds' && (
          <div>
            <h3 style={{ marginTop: 0 }}>Request a Refund</h3>

            {/* Refund request form */}
            <div style={{
              background: '#f9f9f9',
              borderRadius: '12px',
              padding: '1.5rem',
              marginBottom: '1.5rem',
              border: '1px solid #eee'
            }}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={formLabel}>Ticket ID</label>
                <input
                  placeholder="Enter your ticket number"
                  value={refundTicketId}
                  onChange={e => setRefundTicketId(e.target.value)}
                  style={formInput}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={formLabel}>Reason for Refund</label>
                <textarea
                  placeholder="Please explain why you are requesting a refund..."
                  value={refundReason}
                  onChange={e => setRefundReason(e.target.value)}
                  rows={3}
                  style={{ ...formInput, resize: 'vertical' }}
                />
              </div>
              {refundMessage && (
                <p style={{
                  color: refundMessage.includes('✅') ? '#2e7d32' : '#c62828',
                  fontSize: '0.9rem'
                }}>
                  {refundMessage}
                </p>
              )}
              <button
                onClick={handleRefundSubmit}
                style={{
                  padding: '0.7rem 1.5rem',
                  background: '#1a1a2e',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Submit Refund Request
              </button>
            </div>

            {/* Past refund requests */}
            <h4 style={{ marginBottom: '1rem' }}>Past Refund Requests</h4>
            {refunds.length === 0 ? (
              <p style={{ color: '#aaa' }}>No refund requests yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {refunds.map(refund => (
                  <div key={refund.refundId} style={{
                    padding: '1rem 1.25rem',
                    border: '1px solid #eee',
                    borderRadius: '10px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '0.5rem'
                  }}>
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
                        Ticket #{refund.ticketId}
                      </div>
                      <div style={{ color: '#666', fontSize: '0.85rem' }}>
                        {refund.reason}
                      </div>
                      <div style={{ color: '#999', fontSize: '0.8rem' }}>
                        {refund.requestedAt
                          ? new Date(refund.requestedAt).toLocaleDateString()
                          : 'Just now'}
                      </div>
                    </div>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      background: refund.status === 'APPROVED' ? '#e8f5e9'
                        : refund.status === 'REJECTED' ? '#ffebee' : '#fff3e0',
                      color: refund.status === 'APPROVED' ? '#2e7d32'
                        : refund.status === 'REJECTED' ? '#c62828' : '#e65100'
                    }}>
                      {refund.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* NOTIFICATIONS TAB */}
        {activeTab === 'notifications' && (
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem'
            }}>
              <h3 style={{ margin: 0 }}>Notifications</h3>
              {unreadCount > 0 && (
                <span style={{ color: '#888', fontSize: '0.85rem' }}>
                  {unreadCount} unread
                </span>
              )}
            </div>

            {notifications.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#aaa' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔔</div>
                <p>No notifications yet.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {notifications.map(notif => (
                  <div
                    key={notif.notificationId}
                    onClick={() => !notif.read && markAsRead(notif.notificationId)}
                    style={{
                      padding: '1rem 1.25rem',
                      borderRadius: '10px',
                      border: `1px solid ${notif.read ? '#eee' : '#c7d2fe'}`,
                      background: notif.read ? '#f9f9f9' : '#eef2ff',
                      cursor: notif.read ? 'default' : 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: '1.2rem' }}>
                        {notif.notificationType === 'DELAY' ? '⚠️'
                          : notif.notificationType === 'INFO' ? 'ℹ️' : '🔔'}
                      </span>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: '0.9rem',
                          fontWeight: notif.read ? 'normal' : 'bold',
                          color: '#1a1a2e'
                        }}>
                          {notif.message}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#999', marginTop: '0.25rem' }}>
                          {notif.createdAt
                            ? new Date(notif.createdAt).toLocaleString()
                            : 'Just now'}
                          {!notif.read && (
                            <span style={{
                              marginLeft: '8px',
                              color: '#667eea',
                              fontSize: '0.75rem'
                            }}>
                              Click to mark as read
                            </span>
                          )}
                        </div>
                      </div>
                      {!notif.read && (
                        <span style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: '#667eea',
                          display: 'inline-block',
                          flexShrink: 0,
                          marginTop: '4px'
                        }} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const formLabel = {
  display: 'block',
  fontSize: '0.85rem',
  color: '#555',
  marginBottom: '4px',
  fontWeight: '500'
};

const formInput = {
  width: '100%',
  padding: '0.65rem 0.9rem',
  borderRadius: '8px',
  border: '1px solid #ddd',
  fontSize: '0.95rem',
  boxSizing: 'border-box',
  outline: 'none'
};
