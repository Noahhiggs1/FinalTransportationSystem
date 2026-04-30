import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BASE = 'http://localhost:8081/api';

const COLORS = {
  navy: '#0d1b3e',
  navyLight: '#1a3a6e',
  blue: '#2563eb',
  blueLight: '#eff6ff',
  green: '#166534',
  greenLight: '#f0fdf4',
  greenBorder: '#bbf7d0',
  red: '#991b1b',
  redLight: '#fef2f2',
  redBorder: '#fecaca',
  amber: '#92400e',
  amberLight: '#fffbeb',
  amberBorder: '#fde68a',
  gray: '#374151',
  grayLight: '#f9fafb',
  grayBorder: '#e5e7eb',
  textPrimary: '#111827',
  textSecondary: '#6b7280',
  textMuted: '#9ca3af',
  white: '#ffffff',
  border: '#e5e7eb',
};

export default function OperatorDashboard() {
  const navigate = useNavigate();
  const employeeId = sessionStorage.getItem('employeeId');
  const userName = sessionStorage.getItem('userName');
  const userEmail = sessionStorage.getItem('userEmail');


  const [activeTab, setActiveTab] = useState('overview');
  const [vehicle, setVehicle] = useState(null);
  const [incidents, setIncidents] = useState([]);
  const [workLogs, setWorkLogs] = useState([]);
  const [delays, setDelays] = useState([]);
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [clockLoading, setClockLoading] = useState(false);

  const [incidentForm, setIncidentForm] = useState({
    title: '',
    description: '',
    severity: 'LOW',
  });
  const [incidentMsg, setIncidentMsg] = useState({ text: '', type: '' });

  const [delayForm, setDelayForm] = useState({
    message: '',
    estimatedDelayMinutes: '',
    severity: 'MEDIUM',
  });
  const [delayMsg, setDelayMsg] = useState({ text: '', type: '' });

  useEffect(() => {
    if (!employeeId) return;
    Promise.all([
      fetch(`${BASE}/operator/vehicle/${employeeId}`)
        .then(r => r.json()).catch(() => null),
      fetch(`${BASE}/operator/incidents/${employeeId}`)
        .then(r => r.json()).catch(() => []),
      fetch(`${BASE}/operator/worklogs/${employeeId}`)
        .then(r => r.json()).catch(() => []),
      fetch(`${BASE}/operator/delays/${employeeId}`)
        .then(r => r.json()).catch(() => []),
      fetch(`${BASE}/operator/clockstatus/${employeeId}`)
        .then(r => r.json()).catch(() => false),
    ]).then(([v, i, w, d, cs]) => {
      setVehicle(v);
      setIncidents(Array.isArray(i) ? i : []);
      setWorkLogs(Array.isArray(w) ? w : []);
      setDelays(Array.isArray(d) ? d : []);
      setIsClockedIn(cs === true || cs === 'true');
    }).finally(() => setLoading(false));
  }, [employeeId]);

  const handleClockIn = () => {
    setClockLoading(true);
    fetch(`${BASE}/operator/clockin/${employeeId}`, { method: 'POST' })
      .then(r => r.json())
      .then(log => {
        setIsClockedIn(true);
        setWorkLogs(prev => [log, ...prev]);
      })
      .catch(() => alert('Clock in failed. Please try again.'))
      .finally(() => setClockLoading(false));
  };

  const handleClockOut = () => {
    setClockLoading(true);
    fetch(`${BASE}/operator/clockout/${employeeId}`, { method: 'POST' })
      .then(r => r.json())
      .then(log => {
        setIsClockedIn(false);
        setWorkLogs(prev =>
          prev.map(w => w.logId === log.logId ? log : w)
        );
      })
      .catch(() => alert('Clock out failed. Please try again.'))
      .finally(() => setClockLoading(false));
  };

  const handleIncidentSubmit = () => {
    if (!incidentForm.title || !incidentForm.description) {
      setIncidentMsg({ text: 'Title and description are required.', type: 'error' });
      return;
    }
    fetch(`${BASE}/operator/incidents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...incidentForm,
        employeeId: parseInt(employeeId),
        vehicleId: vehicle?.vehicleId || null,
      })
    })
      .then(r => r.json())
      .then(report => {
        setIncidents(prev => [report, ...prev]);
        setIncidentForm({ title: '', description: '', severity: 'LOW' });
        setIncidentMsg({ text: 'Incident report submitted successfully.', type: 'success' });
      })
      .catch(() => setIncidentMsg({ text: 'Failed to submit report.', type: 'error' }));
  };

  const handleDelaySubmit = () => {
    if (!delayForm.message) {
      setDelayMsg({ text: 'A delay message is required.', type: 'error' });
      return;
    }
    fetch(`${BASE}/operator/delays`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...delayForm,
        employeeId: parseInt(employeeId),
        vehicleId: vehicle?.vehicleId || null,
        routeId: vehicle?.routeId || null,
        estimatedDelayMinutes: delayForm.estimatedDelayMinutes
          ? parseInt(delayForm.estimatedDelayMinutes) : null,
      })
    })
      .then(r => r.json())
      .then(delay => {
        setDelays(prev => [delay, ...prev]);
        setDelayForm({ message: '', estimatedDelayMinutes: '', severity: 'MEDIUM' });
        setDelayMsg({ text: 'Delay alert posted successfully.', type: 'success' });
      })
      .catch(() => setDelayMsg({ text: 'Failed to post delay alert.', type: 'error' }));
  };

  const handleResolveDelay = (id) => {
    fetch(`${BASE}/operator/delays/${id}/resolve`, { method: 'PUT' })
      .then(r => r.json())
      .then(updated => {
        setDelays(prev =>
          prev.map(d => d.id === updated.id ? updated : d)
        );
      })
      .catch(() => alert('Could not resolve delay.'));
  };

  const totalHours = workLogs.reduce((sum, w) => sum + (w.totalHours || 0), 0);
  const openIncidents = incidents.filter(i => i.status === 'OPEN').length;
  const activeDelays = delays.filter(d => d.status === 'ACTIVE').length;
  const firstName = userName?.split(' ')[0] || 'Operator';
  const lastName = userName?.split(' ')[1] || '';
  const initials = (firstName[0] || '') + (lastName[0] || '');

  const navItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'profile', label: 'My Profile' },
    { id: 'vehicle', label: 'Assigned Vehicle' },
    { id: 'incidents', label: 'Incident Reports' },
    { id: 'delays', label: 'Delay Alerts' },
    { id: 'hours', label: 'Work Hours' },
  ];

  const getSeverityStyle = (severity) => {
    if (severity === 'HIGH') return { bg: COLORS.redLight, color: COLORS.red, border: COLORS.redBorder };
    if (severity === 'MEDIUM') return { bg: COLORS.amberLight, color: COLORS.amber, border: COLORS.amberBorder };
    return { bg: COLORS.greenLight, color: COLORS.green, border: COLORS.greenBorder };
  };

  const getStatusStyle = (status) => {
    if (status === 'OPEN' || status === 'ACTIVE') {
      return { bg: COLORS.amberLight, color: COLORS.amber, border: COLORS.amberBorder };
    }
    return { bg: COLORS.greenLight, color: COLORS.green, border: COLORS.greenBorder };
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{
          width: '36px',
          height: '36px',
          border: `3px solid ${COLORS.grayBorder}`,
          borderTopColor: COLORS.navy,
          borderRadius: '50%',
          animation: 'spin 0.7s linear infinite'
        }} />
        <p style={{ color: COLORS.textSecondary, margin: 0, fontSize: '0.875rem' }}>
          Loading operator portal...
        </p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '1140px',
      margin: '0 auto',
      fontFamily: '"Inter", "Segoe UI", Arial, sans-serif',
      color: COLORS.textPrimary
    }}>

      {/* Top Header Bar */}
      <div style={{
        background: COLORS.navy,
        borderRadius: '12px',
        padding: '20px 28px',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '8px',
            background: 'rgba(255,255,255,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1rem',
            fontWeight: '700',
            color: COLORS.white,
            letterSpacing: '0.5px',
            flexShrink: 0
          }}>
            {initials}
          </div>
          <div>
            <p style={{
              color: '#90b4e8',
              fontSize: '0.7rem',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              margin: '0 0 2px'
            }}>
              Operator Portal — TranzitSystem
            </p>
            <h2 style={{
              color: COLORS.white,
              margin: 0,
              fontSize: '1.15rem',
              fontWeight: '600'
            }}>
              {userName}
            </h2>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '20px',
            background: isClockedIn
              ? 'rgba(74,222,128,0.12)'
              : 'rgba(255,255,255,0.07)',
            border: `1px solid ${isClockedIn ? 'rgba(74,222,128,0.4)' : 'rgba(255,255,255,0.15)'}`,
          }}>
            <div style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: isClockedIn ? '#4ade80' : '#6b7280',
              flexShrink: 0
            }} />
            <span style={{
              color: isClockedIn ? '#4ade80' : '#9ca3af',
              fontSize: '0.78rem',
              fontWeight: '600',
              whiteSpace: 'nowrap'
            }}>
              {isClockedIn ? 'On Duty' : 'Off Duty'}
            </span>
          </div>

          <button
            onClick={isClockedIn ? handleClockOut : handleClockIn}
            disabled={clockLoading}
            style={{
              padding: '8px 18px',
              background: isClockedIn ? 'transparent' : COLORS.white,
              color: isClockedIn ? COLORS.white : COLORS.navy,
              border: isClockedIn
                ? '1px solid rgba(255,255,255,0.3)'
                : 'none',
              borderRadius: '7px',
              cursor: clockLoading ? 'not-allowed' : 'pointer',
              fontSize: '0.82rem',
              fontWeight: '600',
              opacity: clockLoading ? 0.6 : 1,
              whiteSpace: 'nowrap',
              transition: 'opacity 0.2s'
            }}
          >
            {clockLoading
              ? 'Processing...'
              : isClockedIn
                ? 'Clock Out'
                : 'Clock In'}
          </button>

          <button
            onClick={() => { sessionStorage.clear(); navigate('/login'); }}
            style={{
              padding: '8px 16px',
              background: 'transparent',
              color: '#90b4e8',
              border: '1px solid rgba(144,180,232,0.3)',
              borderRadius: '7px',
              cursor: 'pointer',
              fontSize: '0.78rem',
              fontWeight: '500'
            }}
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '12px',
        marginBottom: '20px'
      }}>
        {[
          {
            label: 'Total Hours Logged',
            value: totalHours.toFixed(1) + ' hrs',
            accent: COLORS.navy
          },
          {
            label: 'Open Incidents',
            value: openIncidents,
            accent: openIncidents > 0 ? COLORS.red : COLORS.green
          },
          {
            label: 'Active Delay Alerts',
            value: activeDelays,
            accent: activeDelays > 0 ? COLORS.amber : COLORS.green
          },
          {
            label: 'Assigned Vehicle',
            value: vehicle ? 'VH-' + vehicle.vehicleId : 'Unassigned',
            accent: vehicle ? COLORS.navy : COLORS.textMuted
          },
        ].map(stat => (
          <div key={stat.label} style={{
            background: COLORS.white,
            borderRadius: '10px',
            padding: '18px 20px',
            border: `1px solid ${COLORS.border}`,
            borderTop: `3px solid ${stat.accent}`,
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
          }}>
            <div style={{
              fontSize: '0.68rem',
              fontWeight: '700',
              color: COLORS.textMuted,
              letterSpacing: '1px',
              textTransform: 'uppercase',
              marginBottom: '8px'
            }}>
              {stat.label}
            </div>
            <div style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: stat.accent
            }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Main Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '210px 1fr',
        gap: '16px'
      }}>

        {/* Sidebar */}
        <div style={{
          background: COLORS.white,
          borderRadius: '10px',
          padding: '8px',
          border: `1px solid ${COLORS.border}`,
          height: 'fit-content',
          boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
        }}>
          <p style={{
            fontSize: '0.65rem',
            fontWeight: '700',
            color: COLORS.textMuted,
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            padding: '8px 10px 4px',
            margin: 0
          }}>
            Navigation
          </p>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                width: '100%',
                padding: '9px 10px',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '0.855rem',
                fontWeight: activeTab === item.id ? '600' : '400',
                background: activeTab === item.id
                  ? COLORS.blueLight
                  : 'transparent',
                color: activeTab === item.id
                  ? COLORS.blue
                  : COLORS.gray,
                marginBottom: '2px',
                transition: 'background 0.15s, color 0.15s',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              <div style={{
                width: '3px',
                height: '14px',
                borderRadius: '2px',
                background: activeTab === item.id
                  ? COLORS.blue
                  : 'transparent',
                flexShrink: 0,
                transition: 'background 0.15s'
              }} />
              {item.label}
            </button>
          ))}
        </div>

        {/* Content Panel */}
        <div style={{
          background: COLORS.white,
          borderRadius: '10px',
          padding: '28px',
          border: `1px solid ${COLORS.border}`,
          boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          minHeight: '480px'
        }}>

          {/* OVERVIEW */}
          {activeTab === 'overview' && (
            <div>
              <div style={styles.tabHeader}>
                <h3 style={styles.tabTitle}>Shift Overview</h3>
                <p style={styles.tabSubtitle}>
                  Summary of your current shift and recent activity
                </p>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                marginBottom: '24px'
              }}>
                {[
                  {
                    label: 'Duty Status',
                    value: isClockedIn ? 'On Duty' : 'Off Duty',
                    valueColor: isClockedIn ? COLORS.green : COLORS.textSecondary
                  },
                  {
                    label: 'Assigned Vehicle',
                    value: vehicle ? 'Vehicle #' + vehicle.vehicleId : 'Not Assigned',
                    valueColor: COLORS.textPrimary
                  },
                  {
                    label: 'Open Incidents',
                    value: openIncidents + ' open',
                    valueColor: openIncidents > 0 ? COLORS.red : COLORS.green
                  },
                  {
                    label: 'Active Delay Alerts',
                    value: activeDelays + ' active',
                    valueColor: activeDelays > 0 ? COLORS.amber : COLORS.green
                  },
                ].map(item => (
                  <div key={item.label} style={styles.infoCard}>
                    <div style={styles.infoLabel}>{item.label}</div>
                    <div style={{
                      fontSize: '0.975rem',
                      fontWeight: '600',
                      color: item.valueColor
                    }}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>

              {workLogs.length > 0 && (
                <div>
                  <h4 style={styles.subHeading}>Most Recent Shift</h4>
                  <div style={styles.infoCard}>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(4, 1fr)',
                      gap: '16px'
                    }}>
                      {[
                        ['Date', workLogs[0].logDate || 'Today'],
                        ['Clock In', workLogs[0].clockIn
                          ? new Date(workLogs[0].clockIn).toLocaleTimeString([], {
                            hour: '2-digit', minute: '2-digit'
                          })
                          : '--'],
                        ['Clock Out', workLogs[0].clockOut
                          ? new Date(workLogs[0].clockOut).toLocaleTimeString([], {
                            hour: '2-digit', minute: '2-digit'
                          })
                          : 'In Progress'],
                        ['Total Hours', workLogs[0].totalHours
                          ? workLogs[0].totalHours + ' hrs'
                          : '--'],
                      ].map(([label, val]) => (
                        <div key={label}>
                          <div style={styles.infoLabel}>{label}</div>
                          <div style={{
                            fontWeight: '600',
                            fontSize: '0.9rem',
                            color: val === 'In Progress'
                              ? COLORS.green
                              : COLORS.textPrimary
                          }}>
                            {val}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PROFILE */}
          {activeTab === 'profile' && (
            <div>
              <div style={styles.tabHeader}>
                <h3 style={styles.tabTitle}>Operator Profile</h3>
                <p style={styles.tabSubtitle}>
                  Your employee information and account details
                </p>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '200px 1fr',
                gap: '24px',
                marginBottom: '24px'
              }}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <div style={{
                    width: '96px',
                    height: '96px',
                    borderRadius: '50%',
                    background: COLORS.navy,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    fontWeight: '700',
                    color: COLORS.white,
                    letterSpacing: '1px',
                    flexShrink: 0
                  }}>
                    {initials}
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      fontWeight: '700',
                      fontSize: '1rem',
                      color: COLORS.textPrimary
                    }}>
                      {userName}
                    </div>
                    <div style={{
                      fontSize: '0.78rem',
                      color: COLORS.textSecondary,
                      marginTop: '4px'
                    }}>
                      Train Operator
                    </div>
                    <div style={{
                      marginTop: '10px',
                      padding: '4px 14px',
                      background: COLORS.blueLight,
                      color: COLORS.blue,
                      borderRadius: '20px',
                      fontSize: '0.72rem',
                      fontWeight: '700',
                      letterSpacing: '0.5px',
                      display: 'inline-block'
                    }}>
                      OPERATOR
                    </div>
                  </div>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                  alignContent: 'start'
                }}>
                  {[
                    ['Full Name', userName || '--'],
                    ['Email Address', userEmail || '--'],
                    ['Employee ID', employeeId || '--'],
                    ['Role', 'Train Operator'],
                    ['Assigned Vehicle', vehicle ? 'Vehicle #' + vehicle.vehicleId : 'Not Assigned'],
                    ['Duty Status', isClockedIn ? 'On Duty' : 'Off Duty'],
                  ].map(([label, value]) => (
                    <div key={label} style={styles.infoCard}>
                      <div style={styles.infoLabel}>{label}</div>
                      <div style={{
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        color: COLORS.textPrimary
                      }}>
                        {value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{
                borderTop: `1px solid ${COLORS.border}`,
                paddingTop: '20px'
              }}>
                <h4 style={styles.subHeading}>Performance Summary</h4>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '12px'
                }}>
                  {[
                    {
                      label: 'Total Shifts',
                      value: workLogs.length
                    },
                    {
                      label: 'Total Hours',
                      value: totalHours.toFixed(1) + ' hrs'
                    },
                    {
                      label: 'Incidents Filed',
                      value: incidents.length
                    },
                  ].map(item => (
                    <div key={item.label} style={{
                      ...styles.infoCard,
                      textAlign: 'center'
                    }}>
                      <div style={{
                        fontSize: '1.6rem',
                        fontWeight: '700',
                        color: COLORS.navy,
                        marginBottom: '4px'
                      }}>
                        {item.value}
                      </div>
                      <div style={styles.infoLabel}>{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* VEHICLE */}
          {activeTab === 'vehicle' && (
            <div>
              <div style={styles.tabHeader}>
                <h3 style={styles.tabTitle}>Assigned Vehicle</h3>
                <p style={styles.tabSubtitle}>
                  Details about the vehicle assigned to you for this shift
                </p>
              </div>

              {!vehicle ? (
                <div style={styles.emptyState}>
                  <div style={styles.emptyBox}>No Vehicle Assigned</div>
                  <p style={{ color: COLORS.textSecondary, margin: '8px 0 0', fontSize: '0.875rem' }}>
                    Contact your administrator for vehicle assignment
                  </p>
                </div>
              ) : (
                <div>
                  <div style={{
                    background: COLORS.navy,
                    borderRadius: '10px',
                    padding: '20px 24px',
                    marginBottom: '16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <div style={{
                        fontSize: '0.68rem',
                        color: '#90b4e8',
                        letterSpacing: '2px',
                        textTransform: 'uppercase',
                        marginBottom: '6px'
                      }}>
                        Vehicle Assignment
                      </div>
                      <div style={{
                        fontSize: '2rem',
                        fontWeight: '700',
                        color: COLORS.white,
                        letterSpacing: '-0.5px'
                      }}>
                        VH-{vehicle.vehicleId}
                      </div>
                    </div>
                    <div style={{
                      padding: '6px 16px',
                      borderRadius: '20px',
                      background: 'rgba(74,222,128,0.15)',
                      border: '1px solid rgba(74,222,128,0.3)',
                      color: '#4ade80',
                      fontSize: '0.78rem',
                      fontWeight: '700'
                    }}>
                      {vehicle.status || 'Active'}
                    </div>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '12px'
                  }}>
                    {[
                      ['Total Capacity', vehicle.capacity + ' seats'],
                      ['Available Seats', vehicle.availableSeats],
                      ['Occupied Seats', vehicle.occupiedSeats],
                      ['Route ID', vehicle.routeId ? 'Route #' + vehicle.routeId : 'Unassigned'],
                      ['Employee ID', vehicle.employeeId || '--'],
                      ['Vehicle ID', vehicle.vehicleId],
                    ].map(([label, val]) => (
                      <div key={label} style={styles.infoCard}>
                        <div style={styles.infoLabel}>{label}</div>
                        <div style={{
                          fontWeight: '600',
                          fontSize: '0.975rem',
                          color: COLORS.textPrimary
                        }}>
                          {val}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* INCIDENTS */}
          {activeTab === 'incidents' && (
            <div>
              <div style={styles.tabHeader}>
                <h3 style={styles.tabTitle}>Incident Reports</h3>
                <p style={styles.tabSubtitle}>
                  Submit and track reports for vehicle or service incidents
                </p>
              </div>

              <div style={styles.formSection}>
                <h4 style={styles.subHeading}>New Incident Report</h4>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 160px',
                  gap: '12px',
                  marginBottom: '12px'
                }}>
                  <div>
                    <label style={styles.label}>Incident Title</label>
                    <input
                      placeholder="Brief summary of the incident"
                      value={incidentForm.title}
                      onChange={e => setIncidentForm(p => ({
                        ...p, title: e.target.value
                      }))}
                      style={styles.input}
                    />
                  </div>
                  <div>
                    <label style={styles.label}>Severity</label>
                    <select
                      value={incidentForm.severity}
                      onChange={e => setIncidentForm(p => ({
                        ...p, severity: e.target.value
                      }))}
                      style={styles.input}
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                    </select>
                  </div>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={styles.label}>Description</label>
                  <textarea
                    placeholder="Provide a detailed description of the incident, including location, time, and any passengers affected..."
                    value={incidentForm.description}
                    onChange={e => setIncidentForm(p => ({
                      ...p, description: e.target.value
                    }))}
                    rows={4}
                    style={{ ...styles.input, resize: 'vertical' }}
                  />
                </div>

                {incidentMsg.text && (
                  <div style={{
                    padding: '10px 14px',
                    borderRadius: '6px',
                    fontSize: '0.855rem',
                    marginBottom: '14px',
                    background: incidentMsg.type === 'success'
                      ? COLORS.greenLight : COLORS.redLight,
                    color: incidentMsg.type === 'success'
                      ? COLORS.green : COLORS.red,
                    border: `1px solid ${incidentMsg.type === 'success'
                      ? COLORS.greenBorder : COLORS.redBorder}`
                  }}>
                    {incidentMsg.text}
                  </div>
                )}

                <button onClick={handleIncidentSubmit} style={styles.primaryBtn}>
                  Submit Incident Report
                </button>
              </div>

              {incidents.length > 0 && (
                <div>
                  <h4 style={{ ...styles.subHeading, marginTop: '28px' }}>
                    Filed Reports ({incidents.length})
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {incidents.map(inc => {
                      const sev = getSeverityStyle(inc.severity);
                      const sta = getStatusStyle(inc.status);
                      return (
                        <div key={inc.id || inc.reportId} style={{
                          border: `1px solid ${COLORS.border}`,
                          borderRadius: '8px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            padding: '10px 16px',
                            background: COLORS.grayLight,
                            borderBottom: `1px solid ${COLORS.border}`,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: '12px',
                            flexWrap: 'wrap'
                          }}>
                            <span style={{
                              fontWeight: '600',
                              fontSize: '0.875rem',
                              color: COLORS.textPrimary
                            }}>
                              {inc.title}
                            </span>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <Badge
                                label={inc.severity}
                                bg={sev.bg}
                                color={sev.color}
                                border={sev.border}
                              />
                              <Badge
                                label={inc.status}
                                bg={sta.bg}
                                color={sta.color}
                                border={sta.border}
                              />
                            </div>
                          </div>
                          <div style={{ padding: '14px 16px' }}>
                            <p style={{
                              margin: '0 0 8px',
                              fontSize: '0.855rem',
                              color: COLORS.gray,
                              lineHeight: '1.6'
                            }}>
                              {inc.description}
                            </p>
                            <p style={{
                              margin: 0,
                              fontSize: '0.75rem',
                              color: COLORS.textMuted
                            }}>
                              Reported:{' '}
                              {inc.reportedAt
                                ? new Date(inc.reportedAt).toLocaleString()
                                : 'Just now'}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* DELAYS */}
          {activeTab === 'delays' && (
            <div>
              <div style={styles.tabHeader}>
                <h3 style={styles.tabTitle}>Delay Alerts</h3>
                <p style={styles.tabSubtitle}>
                  Post delay notifications that passengers will see in real time
                </p>
              </div>

              <div style={styles.formSection}>
                <h4 style={styles.subHeading}>Post New Delay Alert</h4>
                <div style={{ marginBottom: '12px' }}>
                  <label style={styles.label}>Delay Message</label>
                  <textarea
                    placeholder="Describe the delay and reason for passengers. Example: Service delayed due to signal issue at Main Street station."
                    value={delayForm.message}
                    onChange={e => setDelayForm(p => ({
                      ...p, message: e.target.value
                    }))}
                    rows={3}
                    style={{ ...styles.input, resize: 'vertical' }}
                  />
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                  marginBottom: '16px'
                }}>
                  <div>
                    <label style={styles.label}>
                      Estimated Delay (minutes)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 15"
                      value={delayForm.estimatedDelayMinutes}
                      onChange={e => setDelayForm(p => ({
                        ...p, estimatedDelayMinutes: e.target.value
                      }))}
                      style={styles.input}
                      min="0"
                    />
                  </div>
                  <div>
                    <label style={styles.label}>Severity</label>
                    <select
                      value={delayForm.severity}
                      onChange={e => setDelayForm(p => ({
                        ...p, severity: e.target.value
                      }))}
                      style={styles.input}
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                    </select>
                  </div>
                </div>

                {delayMsg.text && (
                  <div style={{
                    padding: '10px 14px',
                    borderRadius: '6px',
                    fontSize: '0.855rem',
                    marginBottom: '14px',
                    background: delayMsg.type === 'success'
                      ? COLORS.greenLight : COLORS.redLight,
                    color: delayMsg.type === 'success'
                      ? COLORS.green : COLORS.red,
                    border: `1px solid ${delayMsg.type === 'success'
                      ? COLORS.greenBorder : COLORS.redBorder}`
                  }}>
                    {delayMsg.text}
                  </div>
                )}

                <button onClick={handleDelaySubmit} style={styles.primaryBtn}>
                  Post Delay Alert
                </button>
              </div>

              {delays.length > 0 && (
                <div>
                  <h4 style={{ ...styles.subHeading, marginTop: '28px' }}>
                    Posted Alerts ({delays.length})
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {delays.map(delay => {
                      const sta = getStatusStyle(delay.status);
                      const sev = getSeverityStyle(delay.severity || 'LOW');
                      return (
                        <div key={delay.id || delay.delayId} style={{
                          padding: '16px',
                          border: `1px solid ${COLORS.border}`,
                          borderLeft: `4px solid ${delay.status === 'ACTIVE'
                            ? '#f59e0b' : '#22c55e'}`,
                          borderRadius: '8px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          gap: '16px',
                          flexWrap: 'wrap'
                        }}>
                          <div style={{ flex: 1 }}>
                            <p style={{
                              margin: '0 0 8px',
                              fontSize: '0.875rem',
                              color: COLORS.textPrimary,
                              fontWeight: '500',
                              lineHeight: '1.5'
                            }}>
                              {delay.message}
                            </p>
                            <div style={{
                              display: 'flex',
                              gap: '16px',
                              flexWrap: 'wrap'
                            }}>
                              {delay.estimatedDelayMinutes && (
                                <span style={{
                                  fontSize: '0.78rem',
                                  color: COLORS.textSecondary
                                }}>
                                  Est. delay: {delay.estimatedDelayMinutes} min
                                </span>
                              )}
                              <span style={{
                                fontSize: '0.78rem',
                                color: COLORS.textMuted
                              }}>
                                {delay.createdAt
                                  ? new Date(delay.createdAt).toLocaleString()
                                  : 'Just now'}
                              </span>
                            </div>
                          </div>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            flexShrink: 0
                          }}>
                            <Badge
                              label={delay.severity || 'LOW'}
                              bg={sev.bg}
                              color={sev.color}
                              border={sev.border}
                            />
                            <Badge
                              label={delay.status}
                              bg={sta.bg}
                              color={sta.color}
                              border={sta.border}
                            />
                            {delay.status === 'ACTIVE' && (
                              <button
                                onClick={() => handleResolveDelay(
                                  delay.id || delay.delayId
                                )}
                                style={{
                                  padding: '4px 12px',
                                  background: 'transparent',
                                  border: `1px solid ${COLORS.green}`,
                                  color: COLORS.green,
                                  borderRadius: '5px',
                                  cursor: 'pointer',
                                  fontSize: '0.75rem',
                                  fontWeight: '600'
                                }}
                              >
                                Mark Resolved
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* HOURS */}
          {activeTab === 'hours' && (
            <div>
              <div style={styles.tabHeader}>
                <h3 style={styles.tabTitle}>Work Hours</h3>
                <p style={styles.tabSubtitle}>
                  Your complete shift history and total hours logged
                </p>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px',
                marginBottom: '24px'
              }}>
                {[
                  { label: 'Total Hours', value: totalHours.toFixed(1) + ' hrs' },
                  { label: 'Total Shifts', value: workLogs.length },
                  {
                    label: 'Avg Hours Per Shift',
                    value: workLogs.length > 0
                      ? (totalHours / workLogs.length).toFixed(1) + ' hrs'
                      : '--'
                  },
                ].map(item => (
                  <div key={item.label} style={{
                    ...styles.infoCard,
                    textAlign: 'center'
                  }}>
                    <div style={{
                      fontSize: '1.6rem',
                      fontWeight: '700',
                      color: COLORS.navy,
                      marginBottom: '4px'
                    }}>
                      {item.value}
                    </div>
                    <div style={styles.infoLabel}>{item.label}</div>
                  </div>
                ))}
              </div>

              {workLogs.length === 0 ? (
                <div style={styles.emptyState}>
                  <div style={styles.emptyBox}>No Records</div>
                  <p style={{
                    color: COLORS.textSecondary,
                    margin: '8px 0 0',
                    fontSize: '0.875rem'
                  }}>
                    Clock in to begin logging your work hours
                  </p>
                </div>
              ) : (
                <div style={{
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr 1fr',
                    padding: '10px 16px',
                    background: COLORS.grayLight,
                    borderBottom: `1px solid ${COLORS.border}`,
                    fontSize: '0.68rem',
                    fontWeight: '700',
                    color: COLORS.textMuted,
                    letterSpacing: '1px',
                    textTransform: 'uppercase'
                  }}>
                    <span>Date</span>
                    <span>Clock In</span>
                    <span>Clock Out</span>
                    <span>Hours</span>
                  </div>
                  {workLogs.map((log, index) => (
                    <div key={log.logId} style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr 1fr 1fr',
                      padding: '12px 16px',
                      borderBottom: index < workLogs.length - 1
                        ? `1px solid ${COLORS.grayBorder}`
                        : 'none',
                      fontSize: '0.875rem',
                      color: COLORS.textPrimary,
                      background: index % 2 === 0
                        ? COLORS.white : COLORS.grayLight
                    }}>
                      <span style={{ fontWeight: '500' }}>
                        {log.logDate
                          ? new Date(log.logDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })
                          : 'Today'}
                      </span>
                      <span>
                        {log.clockIn
                          ? new Date(log.clockIn).toLocaleTimeString([], {
                            hour: '2-digit', minute: '2-digit'
                          })
                          : '--'}
                      </span>
                      <span>
                        {log.clockOut
                          ? new Date(log.clockOut).toLocaleTimeString([], {
                            hour: '2-digit', minute: '2-digit'
                          })
                          : (
                            <span style={{
                              color: COLORS.green,
                              fontWeight: '600',
                              fontSize: '0.78rem'
                            }}>
                              In Progress
                            </span>
                          )}
                      </span>
                      <span style={{ fontWeight: '600', color: COLORS.navy }}>
                        {log.totalHours ? log.totalHours + ' hrs' : '--'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Badge({ label, bg, color, border }) {
  return (
    <span style={{
      padding: '3px 10px',
      borderRadius: '4px',
      fontSize: '0.7rem',
      fontWeight: '700',
      background: bg,
      color: color,
      border: `1px solid ${border}`,
      letterSpacing: '0.3px',
      whiteSpace: 'nowrap'
    }}>
      {label}
    </span>
  );
}

const styles = {
  tabHeader: {
    marginBottom: '20px',
    paddingBottom: '16px',
    borderBottom: `1px solid ${COLORS.border}`
  },
  tabTitle: {
    margin: '0 0 4px',
    fontSize: '1.05rem',
    fontWeight: '700',
    color: COLORS.textPrimary
  },
  tabSubtitle: {
    margin: 0,
    fontSize: '0.845rem',
    color: COLORS.textSecondary
  },
  subHeading: {
    margin: '0 0 12px',
    fontSize: '0.875rem',
    fontWeight: '700',
    color: COLORS.gray,
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  infoCard: {
    background: COLORS.grayLight,
    borderRadius: '8px',
    padding: '14px 16px',
    border: `1px solid ${COLORS.border}`
  },
  infoLabel: {
    fontSize: '0.68rem',
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: '1px',
    textTransform: 'uppercase',
    marginBottom: '6px'
  },
  formSection: {
    background: COLORS.grayLight,
    borderRadius: '8px',
    padding: '20px',
    border: `1px solid ${COLORS.border}`
  },
  label: {
    display: 'block',
    fontSize: '0.78rem',
    fontWeight: '600',
    color: COLORS.gray,
    marginBottom: '6px'
  },
  input: {
    width: '100%',
    padding: '9px 12px',
    borderRadius: '6px',
    border: `1.5px solid ${COLORS.border}`,
    fontSize: '0.875rem',
    boxSizing: 'border-box',
    outline: 'none',
    color: COLORS.textPrimary,
    background: COLORS.white,
    fontFamily: 'inherit'
  },
  primaryBtn: {
    padding: '9px 20px',
    background: COLORS.navy,
    color: COLORS.white,
    border: 'none',
    borderRadius: '7px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.855rem',
    letterSpacing: '0.2px',
    fontFamily: 'inherit'
  },
  emptyState: {
    textAlign: 'center',
    padding: '48px 24px',
    color: COLORS.textMuted
  },
  emptyBox: {
    display: 'inline-block',
    padding: '8px 20px',
    background: COLORS.grayLight,
    border: `1px solid ${COLORS.border}`,
    borderRadius: '6px',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: '8px'
  }
};


