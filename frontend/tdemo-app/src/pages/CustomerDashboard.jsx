import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const userId = sessionStorage.getItem('userId');
  const userName = sessionStorage.getItem('userName');
  const userEmail = sessionStorage.getItem('userEmail');
  const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';

  useEffect(() => {
    if (!isLoggedIn) navigate('/login');
  }, [isLoggedIn, navigate]);

  const [activeTab, setActiveTab] = useState('overview');
  const [tickets, setTickets] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [refunds, setRefunds] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refundTicketId, setRefundTicketId] = useState('');
  const [refundReason, setRefundReason] = useState('');
  const [refundMsg, setRefundMsg] = useState('');

  useEffect(() => {
    if (!userId) return;
    Promise.all([
      fetch(`http://localhost:8081/api/tickets/user/${userId}`).then(r => r.json()).catch(() => []),
      fetch(`http://localhost:8081/api/notifications/user/${userId}`).then(r => r.json()).catch(() => []),
      fetch(`http://localhost:8081/api/refunds/user/${userId}`).then(r => r.json()).catch(() => []),
      fetch('http://localhost:8081/api/routes').then(r => r.json()).catch(() => []),
    ]).then(([t, n, r, ro]) => {
      setTickets(Array.isArray(t) ? t : []);
      setNotifications(Array.isArray(n) ? n : []);
      setRefunds(Array.isArray(r) ? r : []);
      setRoutes(Array.isArray(ro) ? ro : []);
    }).finally(() => setLoading(false));
  }, [userId]);

  const unread = notifications.filter(n => !n.read && !n.isRead).length;

  const handleRefund = () => {
    if (!refundTicketId || !refundReason) {
      setRefundMsg('Please enter a ticket ID and reason.');
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
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(newRefund => {
        setRefunds(prev => [newRefund, ...prev]);
        setRefundMsg('✅ Refund request submitted.');
        setRefundTicketId('');
        setRefundReason('');
      })
      .catch(() => setRefundMsg('❌ Could not submit. Check your ticket ID.'));
  };

  const firstName = userName?.split(' ')[0] || 'Traveler';

  const navItems = [
    { id: 'overview', label: 'My Trips', icon: '🎫' },
    { id: 'tickets', label: 'Ticket Wallet', icon: '👜' },
    { id: 'refunds', label: 'Refunds', icon: '💳' },
    { id: 'notifications', label: 'Notifications', icon: '🔔', badge: unread },
  ];

  if (loading) {
    return (
      <div style={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '1rem',
        color: '#888'
      }}>
        <div style={{ fontSize: '2.5rem' }}>🚆</div>
        <p style={{ margin: 0 }}>Loading your account...</p>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '1100px',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    }}>

      <div style={{
        background: 'linear-gradient(135deg, #0d1b3e, #1a3a6e)',
        borderRadius: '16px',
        padding: '2rem 2.5rem',
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <p style={{
            color: '#90b4e8',
            fontSize: '0.8rem',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            margin: '0 0 4px'
          }}>
            Welcome back
          </p>
          <h2 style={{ color: '#fff', margin: '0 0 4px', fontSize: '1.6rem' }}>
            {firstName}
          </h2>
          <p style={{ color: '#90b4e8', margin: 0, fontSize: '0.85rem' }}>
            {userEmail}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/booking')}
            style={{
              padding: '0.65rem 1.4rem',
              background: '#fff',
              color: '#0d1b3e',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            🚆 Book a Trip
          </button>
          <button
            onClick={() => { sessionStorage.clear(); navigate('/login'); }}
            style={{
              padding: '0.65rem 1.4rem',
              background: 'transparent',
              color: '#90b4e8',
              border: '1px solid #90b4e8',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            Sign Out
          </button>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        {[
          { label: 'Total Trips', value: tickets.length, icon: '🎫', color: '#1a3a6e', bg: '#eef2ff' },
          { label: 'Active Tickets', value: tickets.filter(t => t.bookingStatus === 'CONFIRMED').length, icon: '✅', color: '#2e7d32', bg: '#e8f5e9' },
          { label: 'Pending Refunds', value: refunds.filter(r => r.status === 'PENDING').length, icon: '⏳', color: '#b45309', bg: '#fffbeb' },
          { label: 'Notifications', value: unread, icon: '🔔', color: '#c62828', bg: '#ffebee' },
        ].map(stat => (
          <div key={stat.label} style={{
            background: stat.bg,
            borderRadius: '12px',
            padding: '1.25rem',
            border: `1px solid ${stat.bg}`
          }}>
            <div style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>
              {stat.icon}
            </div>
            <div style={{
              fontSize: '1.8rem',
              fontWeight: '700',
              color: stat.color,
              lineHeight: 1
            }}>
              {stat.value}
            </div>
            <div style={{
              fontSize: '0.78rem',
              color: '#666',
              marginTop: '4px',
              fontWeight: '500'
            }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '1.5rem' }}>

        <div style={{
          background: '#fff',
          borderRadius: '14px',
          padding: '1rem',
          border: '1px solid #e8eaf0',
          height: 'fit-content',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
        }}>
          <p style={{
            fontSize: '0.72rem',
            fontWeight: '700',
            color: '#aaa',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            padding: '0.5rem 0.75rem',
            margin: '0 0 0.5rem'
          }}>
            My Account
          </p>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '0.9rem',
                fontWeight: activeTab === item.id ? '700' : '400',
                background: activeTab === item.id ? '#eef2ff' : 'transparent',
                color: activeTab === item.id ? '#1a3a6e' : '#555',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '2px',
                transition: 'all 0.15s'
              }}
            >
              <span>
                <span style={{ marginRight: '8px' }}>{item.icon}</span>
                {item.label}
              </span>
              {item.badge > 0 && (
                <span style={{
                  background: '#c62828',
                  color: '#fff',
                  borderRadius: '10px',
                  padding: '1px 7px',
                  fontSize: '0.72rem',
                  fontWeight: 'bold'
                }}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        <div style={{
          background: '#fff',
          borderRadius: '14px',
          padding: '1.75rem',
          border: '1px solid #e8eaf0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          minHeight: '400px'
        }}>

          {activeTab === 'overview' && (
            <div>
              <h3 style={{ margin: '0 0 1.5rem', color: '#1a1a2e', fontSize: '1.1rem' }}>
                Route Status
              </h3>
              {routes.length === 0 ? (
                <p style={{ color: '#aaa' }}>No routes available.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {routes.map(route => (
                    <div key={route.routeId} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '1rem 1.25rem',
                      background: '#f8f9ff',
                      borderRadius: '10px',
                      border: '1px solid #e8eaf0'
                    }}>
                      <div>
                        <div style={{
                          fontWeight: '600',
                          color: '#1a1a2e',
                          fontSize: '0.95rem'
                        }}>
                          {route.name}
                        </div>
                        <div style={{ color: '#888', fontSize: '0.8rem', marginTop: '2px' }}>
                          Route #{route.routeId}
                        </div>
                      </div>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.78rem',
                        fontWeight: '600',
                        background: route.status === 'active' ? '#e8f5e9' : '#fff3e0',
                        color: route.status === 'active' ? '#2e7d32' : '#e65100'
                      }}>
                        {route.status === 'active' ? '● On Time' : '⚠ ' + route.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'tickets' && (
            <div>
              <h3 style={{ margin: '0 0 1.5rem', color: '#1a1a2e', fontSize: '1.1rem' }}>
                Ticket Wallet
              </h3>
              {tickets.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#aaa' }}>
                  <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🎫</div>
                  <p style={{ fontWeight: '600', color: '#555', marginBottom: '0.5rem' }}>
                    No tickets yet
                  </p>
                  <p style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                    Book your first trip to see your tickets here
                  </p>
                  <button onClick={() => navigate('/booking')} style={{
                    padding: '0.65rem 1.5rem',
                    background: '#0d1b3e',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}>
                    Book a Trip
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {tickets.map(ticket => (
                    <div key={ticket.ticketId} style={{
                      border: '1px solid #e8eaf0',
                      borderRadius: '12px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        background: ticket.bookingStatus === 'CONFIRMED'
                          ? '#0d1b3e' : '#888',
                        padding: '0.75rem 1.25rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span style={{
                          color: '#fff',
                          fontWeight: '700',
                          fontSize: '0.85rem',
                          letterSpacing: '1px'
                        }}>
                          TICKET #{ticket.ticketId}
                        </span>
                        <span style={{
                          background: ticket.bookingStatus === 'CONFIRMED'
                            ? '#4ade80' : '#ffb74d',
                          color: ticket.bookingStatus === 'CONFIRMED'
                            ? '#14532d' : '#7c3a00',
                          padding: '2px 10px',
                          borderRadius: '12px',
                          fontSize: '0.72rem',
                          fontWeight: '700'
                        }}>
                          {ticket.bookingStatus}
                        </span>
                      </div>

                      <div style={{
                        padding: '1.25rem',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '1rem'
                      }}>
                        <div>
                          <div style={{ fontSize: '0.72rem', color: '#aaa', marginBottom: '4px', fontWeight: '600', letterSpacing: '1px' }}>
                            SEAT
                          </div>
                          <div style={{ fontWeight: '700', fontSize: '1.1rem', color: '#1a1a2e' }}>
                            {ticket.seatNumber || 'N/A'}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.72rem', color: '#aaa', marginBottom: '4px', fontWeight: '600', letterSpacing: '1px' }}>
                            DEPARTURE
                          </div>
                          <div style={{ fontWeight: '600', fontSize: '0.9rem', color: '#1a1a2e' }}>
                            {ticket.departureTime
                              ? new Date(ticket.departureTime).toLocaleDateString()
                              : 'TBD'}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.72rem', color: '#aaa', marginBottom: '4px', fontWeight: '600', letterSpacing: '1px' }}>
                            BOOKED ON
                          </div>
                          <div style={{ fontWeight: '600', fontSize: '0.9rem', color: '#1a1a2e' }}>
                            {ticket.bookingTimestamp
                              ? new Date(ticket.bookingTimestamp).toLocaleDateString()
                              : 'N/A'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'refunds' && (
            <div>
              <h3 style={{ margin: '0 0 1.5rem', color: '#1a1a2e', fontSize: '1.1rem' }}>
                Request a Refund
              </h3>

              <div style={{
                background: '#f8f9ff',
                borderRadius: '12px',
                padding: '1.5rem',
                marginBottom: '2rem',
                border: '1px solid #e8eaf0'
              }}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={formLabel}>Ticket ID</label>
                  <input
                    placeholder="Enter your ticket number e.g. 42"
                    value={refundTicketId}
                    onChange={e => setRefundTicketId(e.target.value)}
                    style={formInput}
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={formLabel}>Reason for Refund</label>
                  <textarea
                    placeholder="Please describe why you are requesting a refund..."
                    value={refundReason}
                    onChange={e => setRefundReason(e.target.value)}
                    rows={3}
                    style={{ ...formInput, resize: 'vertical' }}
                  />
                </div>
                {refundMsg && (
                  <p style={{
                    color: refundMsg.includes('✅') ? '#2e7d32' : '#c62828',
                    fontSize: '0.875rem',
                    marginBottom: '1rem'
                  }}>
                    {refundMsg}
                  </p>
                )}
                <button onClick={handleRefund} style={{
                  padding: '0.7rem 1.5rem',
                  background: '#0d1b3e',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '0.9rem'
                }}>
                  Submit Refund Request
                </button>
              </div>

              <h4 style={{ margin: '0 0 1rem', color: '#555', fontSize: '0.95rem' }}>
                Refund History
              </h4>
              {refunds.length === 0 ? (
                <p style={{ color: '#aaa', fontSize: '0.9rem' }}>
                  No refund requests yet.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {refunds.map(refund => (
                    <div key={refund.refundId} style={{
                      padding: '1rem 1.25rem',
                      border: '1px solid #e8eaf0',
                      borderRadius: '10px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '0.5rem'
                    }}>
                      <div>
                        <div style={{ fontWeight: '600', fontSize: '0.9rem', color: '#1a1a2e' }}>
                          Ticket #{refund.ticketId}
                        </div>
                        <div style={{ color: '#777', fontSize: '0.82rem', marginTop: '2px' }}>
                          {refund.reason}
                        </div>
                        <div style={{ color: '#aaa', fontSize: '0.78rem', marginTop: '2px' }}>
                          {refund.requestedAt
                            ? new Date(refund.requestedAt).toLocaleDateString()
                            : 'Just submitted'}
                        </div>
                      </div>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.78rem',
                        fontWeight: '700',
                        background: refund.status === 'APPROVED' ? '#e8f5e9'
                          : refund.status === 'REJECTED' ? '#ffebee' : '#fffbeb',
                        color: refund.status === 'APPROVED' ? '#2e7d32'
                          : refund.status === 'REJECTED' ? '#c62828' : '#b45309'
                      }}>
                        {refund.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem'
              }}>
                <h3 style={{ margin: 0, color: '#1a1a2e', fontSize: '1.1rem' }}>
                  Notifications
                </h3>
                {unread > 0 && (
                  <span style={{ color: '#888', fontSize: '0.85rem' }}>
                    {unread} unread
                  </span>
                )}
              </div>
              {notifications.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#aaa' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔔</div>
                  <p>No notifications yet.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {notifications.map(notif => {
                    const isRead = notif.read || notif.isRead;
                    return (
                      <div key={notif.notificationId} style={{
                        padding: '1rem 1.25rem',
                        borderRadius: '10px',
                        border: `1px solid ${isRead ? '#e8eaf0' : '#c7d2fe'}`,
                        background: isRead ? '#fff' : '#f0f4ff',
                        cursor: isRead ? 'default' : 'pointer'
                      }}>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                          <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>
                            {notif.notificationType === 'DELAY' ? '⚠️'
                              : notif.notificationType === 'BOOKING' ? '🎫' : 'ℹ️'}
                          </span>
                          <div style={{ flex: 1 }}>
                            <div style={{
                              fontSize: '0.9rem',
                              fontWeight: isRead ? '400' : '600',
                              color: '#1a1a2e'
                            }}>
                              {notif.message}
                            </div>
                            <div style={{
                              fontSize: '0.78rem',
                              color: '#aaa',
                              marginTop: '4px'
                            }}>
                              {notif.createdAt
                                ? new Date(notif.createdAt).toLocaleString()
                                : 'Just now'}
                            </div>
                          </div>
                          {!isRead && (
                            <div style={{
                              width: '8px', height: '8px',
                              borderRadius: '50%',
                              background: '#1a3a6e',
                              flexShrink: 0,
                              marginTop: '5px'
                            }} />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const formLabel = {
  display: 'block',
  fontSize: '0.8rem',
  fontWeight: '600',
  color: '#555',
  marginBottom: '6px',
  letterSpacing: '0.5px'
};

const formInput = {
  width: '100%',
  padding: '0.7rem 0.9rem',
  borderRadius: '8px',
  border: '1.5px solid #e0e0e0',
  fontSize: '0.9rem',
  boxSizing: 'border-box',
  outline: 'none',
  color: '#1a1a2e'
};