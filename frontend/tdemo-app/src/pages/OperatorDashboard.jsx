import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const BASE = "http://localhost:8081/api/admin";

const TABS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "revenue",   label: "Revenue" },
  { id: "crowd",     label: "Crowd Analytics" },
  { id: "delays",    label: "Delays" },
  { id: "fleet",     label: "Fleet" },
  { id: "tickets",   label: "Tickets" },
  { id: "refunds",   label: "Refunds" },
  { id: "patterns",  label: "Patterns" },
];

const STATUS_COLORS = {
  COMPLETED: "#22c55e", PENDING: "#f59e0b", REFUNDED: "#3b82f6",
  APPROVED: "#22c55e",  REJECTED: "#ef4444", ACTIVE: "#ef4444",
  RESOLVED: "#22c55e",  Available: "#22c55e", Busy: "#f59e0b", Full: "#ef4444",
  BOOKED: "#3b82f6",    CANCELLED: "#ef4444",
  HIGH: "#ef4444", MEDIUM: "#f59e0b", LOW: "#22c55e",
  CRITICAL: "#7c3aed",
};

function Badge({ value }) {
  const color = STATUS_COLORS[value] ?? "#6b7280";
  return (
    <span style={{
      background: color + "22", color, border: `1px solid ${color}44`,
      padding: "2px 8px", borderRadius: 99, fontSize: 11, fontWeight: 600,
      letterSpacing: "0.04em", textTransform: "uppercase",
    }}>{value}</span>
  );
}

function KPI({ label, value, sub, accent }) {
  return (
    <div style={{
      background: "#111827", border: "1px solid #1f2937",
      borderRadius: 12, padding: "18px 20px",
    }}>
      <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, color: accent ?? "#f9fafb", fontFamily: "'DM Mono', monospace" }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: "#4b5563", marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function Table({ columns, rows, renderCell }) {
  if (!rows || rows.length === 0) return <div style={{ color: "#4b5563", padding: "24px 0", textAlign: "center", fontSize: 13 }}>No data found.</div>;
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr>
            {columns.map(c => (
              <th key={c} style={{ textAlign: "left", padding: "8px 12px", color: "#6b7280", borderBottom: "1px solid #1f2937", fontWeight: 500, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em" }}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: "1px solid #111827" }}>
              {columns.map(c => (
                <td key={c} style={{ padding: "10px 12px", color: "#d1d5db" }}>
                  {renderCell ? renderCell(c, row) : String(row[c] ?? "—")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SectionCard({ title, children, right }) {
  return (
    <div style={{ background: "#0d1117", border: "1px solid #1f2937", borderRadius: 14, padding: 24, marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "#f3f4f6" }}>{title}</h2>
        {right}
      </div>
      {children}
    </div>
  );
}

function useFetch(url, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch(url);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      setData(await r.json());
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => { load(); }, deps);
  return { data, loading, error, reload: load };
}

// ─── Dashboard Tab ─────────────────────────────────────────────────────────────
function DashboardTab() {
  const { data, loading, error } = useFetch(`${BASE}/analytics/dashboard`);
  if (loading) return <Loader />;
  if (error) return <Err msg={error} />;

  const { revenue, tickets, fleet, crowd, delays } = data;

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 24 }}>
        <KPI label="Net Revenue" value={`$${(revenue.netRevenue ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} sub="after refunds" accent="#34d399" />
        <KPI label="Total Tickets" value={tickets.totalTickets} />
        <KPI label="Fleet Vehicles" value={fleet.totalVehicles} sub={`${fleet.avgOccupancyPct}% avg occupancy`} />
        <KPI label="Avg Station Crowd" value={`${crowd.avgOccupancyPct}%`} sub={`${crowd.totalLogs} sensor logs`} accent="#fb923c" />
        <KPI label="Active Delays" value={delays.byStatus?.ACTIVE ?? 0} accent="#f87171" />
        <KPI label="Pending Refunds" value={revenue.pendingCount} accent="#fbbf24" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <SectionCard title="Revenue by payment method">
          {Object.entries(revenue.revenueByMethod ?? {}).map(([method, amt]) => (
            <div key={method} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #1f2937", fontSize: 13 }}>
              <span style={{ color: "#9ca3af" }}>{method}</span>
              <span style={{ color: "#f9fafb", fontFamily: "'DM Mono', monospace" }}>${amt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          ))}
        </SectionCard>

        <SectionCard title="Delays by severity">
          {Object.entries(delays.bySeverity ?? {}).map(([sev, cnt]) => (
            <div key={sev} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: "1px solid #1f2937", fontSize: 13 }}>
              <Badge value={sev} />
              <span style={{ color: "#f9fafb", fontFamily: "'DM Mono', monospace" }}>{cnt} events</span>
            </div>
          ))}
          <div style={{ marginTop: 12, fontSize: 12, color: "#6b7280" }}>Avg delay: {delays.avgDelayMinutes} min</div>
        </SectionCard>

        <SectionCard title="Crowd status breakdown">
          {Object.entries(crowd.byStatus ?? {}).map(([st, cnt]) => (
            <div key={st} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: "1px solid #1f2937", fontSize: 13 }}>
              <Badge value={st} />
              <span style={{ color: "#f9fafb", fontFamily: "'DM Mono', monospace" }}>{cnt} logs</span>
            </div>
          ))}
        </SectionCard>

        <SectionCard title="Ticket status breakdown">
          {Object.entries(tickets.byStatus ?? {}).map(([st, cnt]) => (
            <div key={st} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: "1px solid #1f2937", fontSize: 13 }}>
              <Badge value={st} />
              <span style={{ color: "#f9fafb", fontFamily: "'DM Mono', monospace" }}>{cnt}</span>
            </div>
          ))}
        </SectionCard>
      </div>
    </>
  );
}

// ─── Revenue Tab ───────────────────────────────────────────────────────────────
function RevenueTab() {
  const summary = useFetch(`${BASE}/analytics/revenue/summary`);
  const payments = useFetch(`${BASE}/analytics/revenue/all-payments`);

  if (summary.loading || payments.loading) return <Loader />;
  if (summary.error) return <Err msg={summary.error} />;

  const s = summary.data;

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 24 }}>
        <KPI label="Gross Revenue" value={`$${(s.totalRevenue ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} accent="#34d399" />
        <KPI label="Refunded" value={`$${(s.refundedAmount ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} accent="#f87171" />
        <KPI label="Net Revenue" value={`$${(s.netRevenue ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} accent="#34d399" />
        <KPI label="Completed" value={s.completedCount} />
        <KPI label="Refunded txns" value={s.refundedCount} />
        <KPI label="Pending" value={s.pendingCount} accent="#fbbf24" />
      </div>

      <SectionCard title="All transactions">
        <Table
          columns={["paymentId", "ticketId", "method", "amount", "status", "transactionRef"]}
          rows={payments.data ?? []}
          renderCell={(col, row) => {
            if (col === "amount") return `$${(row.amount ?? 0).toFixed(2)}`;
            if (col === "status") return <Badge value={row.status} />;
            return String(row[col] ?? "—");
          }}
        />
      </SectionCard>
    </>
  );
}

// ─── Crowd Tab ─────────────────────────────────────────────────────────────────
function CrowdTab() {
  const { data, loading, error } = useFetch(`${BASE}/analytics/crowd/all`);
  const sum = useFetch(`${BASE}/analytics/crowd/summary`);
  if (loading || sum.loading) return <Loader />;
  if (error) return <Err msg={error} />;

  const s = sum.data ?? {};

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 24 }}>
        <KPI label="Total Logs" value={s.totalLogs ?? 0} />
        <KPI label="Avg Occupancy" value={`${s.avgOccupancyPct ?? 0}%`} accent="#fb923c" />
        {Object.entries(s.byStatus ?? {}).map(([st, cnt]) => (
          <KPI key={st} label={st} value={cnt} accent={STATUS_COLORS[st]} />
        ))}
      </div>

      <SectionCard title="Sensor crowd logs">
        <Table
          columns={["logId", "stationName", "sensorId", "occupancyPercentage", "status", "timestamp"]}
          rows={data ?? []}
          renderCell={(col, row) => {
            if (col === "status") return <Badge value={row.status} />;
            if (col === "occupancyPercentage") return `${row.occupancyPercentage}%`;
            if (col === "timestamp") return row.timestamp ? new Date(row.timestamp).toLocaleString() : "—";
            return String(row[col] ?? "—");
          }}
        />
      </SectionCard>
    </>
  );
}

// ─── Delays Tab ────────────────────────────────────────────────────────────────
function DelaysTab() {
  const { data, loading, error, reload } = useFetch(`${BASE}/delays/active`);
  const all = useFetch(`${BASE}/analytics/delays/all`);
  const sum = useFetch(`${BASE}/analytics/delays/summary`);
  if (loading || all.loading || sum.loading) return <Loader />;

  const s = sum.data ?? {};

  const resolveDelay = async (id) => {
    await fetch(`${BASE}/delays/resolve/${id}`, { method: "PUT" });
    reload(); all.reload();
  };

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 24 }}>
        <KPI label="Total Events" value={s.totalEvents ?? 0} />
        <KPI label="Avg Delay" value={`${s.avgDelayMinutes ?? 0} min`} accent="#f87171" />
        {Object.entries(s.bySeverity ?? {}).map(([sev, cnt]) => (
          <KPI key={sev} label={sev} value={cnt} accent={STATUS_COLORS[sev]} />
        ))}
      </div>

      <SectionCard title="Active incidents" right={
        <span style={{ fontSize: 12, color: "#6b7280" }}>{(data ?? []).length} active</span>
      }>
        <Table
          columns={["eventId", "type", "severity", "affectedLines", "estimatedDelayMinutes", "status", "action"]}
          rows={data ?? []}
          renderCell={(col, row) => {
            if (col === "severity" || col === "status") return <Badge value={row[col]} />;
            if (col === "affectedLines") return (row.affectedLines ?? []).join(", ");
            if (col === "estimatedDelayMinutes") return `${row.estimatedDelayMinutes} min`;
            if (col === "action") return (
              <button onClick={() => resolveDelay(row.id)} style={{
                background: "#064e3b", color: "#34d399", border: "1px solid #065f46",
                padding: "4px 10px", borderRadius: 6, cursor: "pointer", fontSize: 12,
              }}>Resolve</button>
            );
            return String(row[col] ?? "—");
          }}
        />
      </SectionCard>

      <SectionCard title="All delay events">
        <Table
          columns={["eventId", "type", "severity", "estimatedDelayMinutes", "status", "incidentNarrative"]}
          rows={all.data ?? []}
          renderCell={(col, row) => {
            if (col === "severity" || col === "status") return <Badge value={row[col]} />;
            if (col === "estimatedDelayMinutes") return `${row.estimatedDelayMinutes} min`;
            if (col === "incidentNarrative") return <span style={{ color: "#9ca3af", fontSize: 12 }}>{row.incidentNarrative || "—"}</span>;
            return String(row[col] ?? "—");
          }}
        />
      </SectionCard>
    </>
  );
}

// ─── Fleet Tab ─────────────────────────────────────────────────────────────────
function FleetTab() {
  const { data, loading, error } = useFetch(`${BASE}/analytics/fleet/all`);
  const sum = useFetch(`${BASE}/analytics/fleet/summary`);
  if (loading || sum.loading) return <Loader />;
  if (error) return <Err msg={error} />;

  const s = sum.data ?? {};

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 24 }}>
        <KPI label="Total Vehicles" value={s.totalVehicles ?? 0} />
        <KPI label="Total Capacity" value={s.totalCapacity ?? 0} />
        <KPI label="Seats Occupied" value={s.totalOccupied ?? 0} />
        <KPI label="Avg Occupancy" value={`${s.avgOccupancyPct ?? 0}%`} accent="#fb923c" />
      </div>

      <SectionCard title="Vehicle fleet">
        <Table
          columns={["vehicleId", "capacity", "occupiedSeats", "availableSeats", "routeId", "utilization"]}
          rows={data ?? []}
          renderCell={(col, row) => {
            if (col === "utilization") {
              const pct = row.capacity > 0 ? Math.round((row.occupiedSeats / row.capacity) * 100) : 0;
              const color = pct > 80 ? "#ef4444" : pct > 50 ? "#f59e0b" : "#22c55e";
              return (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ flex: 1, height: 6, background: "#1f2937", borderRadius: 99 }}>
                    <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 99 }} />
                  </div>
                  <span style={{ color, fontSize: 12, minWidth: 34 }}>{pct}%</span>
                </div>
              );
            }
            return String(row[col] ?? "—");
          }}
        />
      </SectionCard>
    </>
  );
}

// ─── Tickets Tab ───────────────────────────────────────────────────────────────
function TicketsTab() {
  const { data, loading, error } = useFetch(`${BASE}/analytics/tickets/all`);
  const sum = useFetch(`${BASE}/analytics/tickets/summary`);
  if (loading || sum.loading) return <Loader />;
  if (error) return <Err msg={error} />;

  const s = sum.data ?? {};

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 24 }}>
        <KPI label="Total Tickets" value={s.totalTickets ?? 0} />
        {Object.entries(s.byStatus ?? {}).map(([st, cnt]) => (
          <KPI key={st} label={st} value={cnt} accent={STATUS_COLORS[st]} />
        ))}
      </div>

      <SectionCard title="All tickets">
        <Table
          columns={["ticketId", "seatNumber", "bookingStatus", "userId", "vehicleId", "departureTime", "arrivalTime"]}
          rows={data ?? []}
          renderCell={(col, row) => {
            if (col === "bookingStatus") return <Badge value={row.bookingStatus} />;
            if (col === "departureTime" || col === "arrivalTime") return row[col] ? new Date(row[col]).toLocaleString() : "—";
            return String(row[col] ?? "—");
          }}
        />
      </SectionCard>
    </>
  );
}

// ─── Refunds Tab ───────────────────────────────────────────────────────────────
function RefundsTab() {
  const { data, loading, error, reload } = useFetch(`${BASE}/analytics/refunds/all`);
  if (loading) return <Loader />;
  if (error) return <Err msg={error} />;

  const pending = (data ?? []).filter(r => r.status === "PENDING");
  const rest    = (data ?? []).filter(r => r.status !== "PENDING");

  const act = async (id, action) => {
    await fetch(`${BASE}/analytics/refunds/${id}/${action}`, { method: "PUT" });
    reload();
  };

  const cols = ["refundId", "ticketId", "userId", "reason", "status", "requestedAt", "action"];

  const renderCell = (col, row) => {
    if (col === "status") return <Badge value={row.status} />;
    if (col === "requestedAt") return row.requestedAt ? new Date(row.requestedAt).toLocaleString() : "—";
    if (col === "action" && row.status === "PENDING") return (
      <div style={{ display: "flex", gap: 6 }}>
        <button onClick={() => act(row.refundId, "approve")} style={{ background: "#064e3b", color: "#34d399", border: "1px solid #065f46", padding: "3px 9px", borderRadius: 6, cursor: "pointer", fontSize: 12 }}>Approve</button>
        <button onClick={() => act(row.refundId, "reject")} style={{ background: "#450a0a", color: "#f87171", border: "1px solid #7f1d1d", padding: "3px 9px", borderRadius: 6, cursor: "pointer", fontSize: 12 }}>Reject</button>
      </div>
    );
    if (col === "action") return "—";
    return String(row[col] ?? "—");
  };

  return (
    <>
      <SectionCard title={`Pending refund requests`} right={<span style={{ fontSize: 12, color: "#fbbf24" }}>{pending.length} awaiting action</span>}>
        <Table columns={cols} rows={pending} renderCell={renderCell} />
      </SectionCard>

      <SectionCard title="Resolved refunds">
        <Table columns={["refundId", "ticketId", "userId", "reason", "status", "requestedAt", "resolvedAt"]} rows={rest}
          renderCell={(col, row) => {
            if (col === "status") return <Badge value={row.status} />;
            if (col === "requestedAt" || col === "resolvedAt") return row[col] ? new Date(row[col]).toLocaleString() : "—";
            return String(row[col] ?? "—");
          }}
        />
      </SectionCard>
    </>
  );
}

// ─── Patterns Tab ──────────────────────────────────────────────────────────────
function PatternsTab() {
  const { data, loading, error } = useFetch(`${BASE}/analytics/patterns/all`);
  if (loading) return <Loader />;
  if (error) return <Err msg={error} />;

  const rows = data ?? [];
  const topRoutes = [...new Set(rows.map(r => r.routeId))];

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 24 }}>
        <KPI label="Recorded Patterns" value={rows.length} />
        <KPI label="Unique Routes" value={topRoutes.length} />
        <KPI label="Avg Volume" value={rows.length ? Math.round(rows.reduce((a, r) => a + r.averageVolume, 0) / rows.length) : 0} sub="passengers" />
      </div>

      <SectionCard title="Passenger travel patterns">
        <Table
          columns={["routeId", "stationOrigin", "stationDestination", "peakHour", "averageVolume", "lastUpdated"]}
          rows={rows}
          renderCell={(col, row) => {
            if (col === "averageVolume") return (
              <span style={{ color: row.averageVolume > 500 ? "#f87171" : row.averageVolume > 200 ? "#fbbf24" : "#34d399", fontFamily: "'DM Mono', monospace" }}>
                {row.averageVolume}
              </span>
            );
            if (col === "lastUpdated") return row.lastUpdated ? new Date(row.lastUpdated).toLocaleString() : "—";
            return String(row[col] ?? "—");
          }}
        />
      </SectionCard>
    </>
  );
}

function Loader() {
  return <div style={{ padding: 40, textAlign: "center", color: "#4b5563", fontSize: 13 }}>Loading…</div>;
}

function Err({ msg }) {
  return (
    <div style={{ padding: 20, background: "#1c0a0a", border: "1px solid #7f1d1d", borderRadius: 10, color: "#f87171", fontSize: 13 }}>
      Failed to load: {msg}. Make sure the Spring Boot server is running on port 8081.
    </div>
  );
}

const TAB_COMPONENTS = {
  dashboard: DashboardTab,
  revenue: RevenueTab,
  crowd: CrowdTab,
  delays: DelaysTab,
  fleet: FleetTab,
  tickets: TicketsTab,
  refunds: RefundsTab,
  patterns: PatternsTab,
};

export default function AdminPortal() {
  const navigate = useNavigate();
  const [active, setActive] = useState("dashboard");
  const Tab = TAB_COMPONENTS[active];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#060a10",
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      color: "#f9fafb",
    }}>
      {/* Sidebar */}
      <div style={{
        position: "fixed", top: 0, left: 0, bottom: 0, width: 220,
        background: "#0d1117", borderRight: "1px solid #1f2937",
        display: "flex", flexDirection: "column",
      }}>
        <div style={{ padding: "24px 20px 16px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: "#4b5563", textTransform: "uppercase", marginBottom: 2 }}>TranzitBooking</div>
          <div style={{ fontSize: 17, fontWeight: 700, color: "#f9fafb" }}>Admin Console</div>
        </div>
        <nav style={{ flex: 1, padding: "8px 12px" }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setActive(t.id)} style={{
              display: "block", width: "100%", textAlign: "left",
              padding: "9px 12px", marginBottom: 2,
              background: active === t.id ? "#1f2937" : "transparent",
              border: "none", borderRadius: 8,
              color: active === t.id ? "#f9fafb" : "#6b7280",
              fontSize: 13, fontWeight: active === t.id ? 600 : 400,
              cursor: "pointer", transition: "all 0.15s",
            }}>{t.label}</button>
          ))}
        </nav>
        <div style={{ padding: "16px 20px", borderTop: "1px solid #1f2937", fontSize: 11, color: "#374151" }}>
          Connected to :8081
        </div>
      </div>

      {/* Main content */}
      <div style={{ marginLeft: 220, padding: "32px 32px 32px" }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#f9fafb" }}>
            {TABS.find(t => t.id === active)?.label}
          </h1>
          <div style={{ fontSize: 12, color: "#4b5563", marginTop: 4 }}>
            {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </div>
        </div>
        <Tab />
      </div>
    </div>
  );

}

