import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:5000/api/hours";

// ---------- DATE HELPERS ----------
// Format Date object as YYYY-MM-DD string
const formatDate = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(d.getDate()).padStart(2, "0")}`;
};

// Start of week (Monday)
const startOfWeek = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d;
};

const addDays = (date, days) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

const startOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1);
const addMonths = (date, months) =>
  new Date(date.getFullYear(), date.getMonth() + months, 1);
const daysInMonth = (date) =>
  new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

function App() {
  const [view, setView] = useState("week");

  // Store hours from backend, key = YYYY-MM-DD
  const [hours, setHours] = useState({});

  // Fetch hours from backend
  useEffect(() => {
    axios
      .get(API_URL)
      .then((res) => {
        const map = {};
        res.data.data.allHours.forEach((log) => {
          const key = log.date.slice(0, 10); // treat as string YYYY-MM-DD
          map[key] = {
            id: log._id,
            activeHrs: log.activeHrs,
            passiveHrs: log.passiveHrs,
          };
        });
        setHours(map);
      })
      .catch((err) => console.error(err));
  }, []);

  // ---------- Weekly ----------
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date()));
  const weekDays = [...Array(7)].map((_, i) => addDays(weekStart, i));

  // ---------- Monthly ----------
  const [monthStart, setMonthStart] = useState(startOfMonth(new Date()));
  const monthDays = [...Array(daysInMonth(monthStart))].map(
    (_, i) => new Date(monthStart.getFullYear(), monthStart.getMonth(), i + 1)
  );

  // ---------- Input handler ----------
  const handleInput = async (day, field, value) => {
    const key = formatDate(day);
    const num = Number(value);
    const existing = hours[key];

    if (!existing) {
      // create new
      try {
        const res = await axios.post(API_URL, {
          date: key,
          activeHrs: field === "activeHrs" ? num : 0,
          passiveHrs: field === "passiveHrs" ? num : 0,
        });
        setHours((prev) => ({
          ...prev,
          [key]: {
            id: res.data.data.hourLog._id,
            activeHrs: res.data.data.hourLog.activeHrs,
            passiveHrs: res.data.data.hourLog.passiveHrs,
          },
        }));
      } catch (err) {
        console.error(err);
      }
    } else {
      // update existing
      try {
        const updated = { ...existing, [field]: num };
        await axios.patch(`${API_URL}/${existing.id}`, updated);
        setHours((prev) => ({ ...prev, [key]: updated }));
      } catch (err) {
        console.error(err);
      }
    }
  };

  // ---------- Totals ----------
  const sum = (days, field) =>
    days.reduce((acc, day) => acc + (hours[formatDate(day)]?.[field] || 0), 0);

  // Weekly totals
  const weeklyActive = sum(weekDays, "activeHrs");
  const weeklyPassive = sum(weekDays, "passiveHrs");
  const weeklyTotal = weeklyActive + weeklyPassive;

  // Monthly totals
  const monthlyActive = sum(monthDays, "activeHrs");
  const monthlyPassive = sum(monthDays, "passiveHrs");
  const monthlyTotal = monthlyActive + monthlyPassive;

  // Yearly totals
  const year = monthStart.getFullYear();
  const yearlyTotals = Array.from({ length: 12 }, (_, m) => {
    const firstDay = new Date(year, m, 1);
    const days = [...Array(daysInMonth(firstDay))].map(
      (_, i) => new Date(year, m, i + 1)
    );
    const active = sum(days, "activeHrs");
    const passive = sum(days, "passiveHrs");
    return {
      month: firstDay.toLocaleString("default", { month: "short" }),
      active,
      passive,
      total: active + passive,
    };
  });
  const yearlyActive = yearlyTotals.reduce((acc, m) => acc + m.active, 0);
  const yearlyPassive = yearlyTotals.reduce((acc, m) => acc + m.passive, 0);
  const yearlyTotal = yearlyActive + yearlyPassive;

  // ---------- UI ----------
  return (
    <div className="App">
      <h1>Hours Tracker</h1>

      <div className="toggle-buttons">
        <button
          className={view === "week" ? "active" : ""}
          onClick={() => setView("week")}
        >
          Weekly
        </button>
        <button
          className={view === "month" ? "active" : ""}
          onClick={() => setView("month")}
        >
          Monthly
        </button>
      </div>

      {/* Weekly */}
      {view === "week" && (
        <div className="weekly-view">
          <h2>Weekly Calendar</h2>
          <div className="weekly-totals">
            <p>Total: {weeklyTotal}</p>
            <p>Active: {weeklyActive}</p>
            <p>Passive: {weeklyPassive}</p>
          </div>
          <div className="week-controls">
            <button onClick={() => setWeekStart(addDays(weekStart, -7))}>
              Previous Week
            </button>
            <span>
              {formatDate(weekStart)} - {formatDate(addDays(weekStart, 6))}
            </span>
            <button onClick={() => setWeekStart(addDays(weekStart, 7))}>
              Next Week
            </button>
          </div>
          <ul className="week-days">
            {weekDays.map((day) => {
              const key = formatDate(day);
              const h = hours[key] || {};
              return (
                <li
                  key={key}
                  className={key === formatDate(new Date()) ? "today" : ""}
                >
                  {key}
                  <div className="day-input">
                    <label>
                      Active:
                      <input
                        type="number"
                        min="0"
                        value={h.activeHrs || ""}
                        onChange={(e) =>
                          handleInput(day, "activeHrs", e.target.value)
                        }
                      />
                    </label>
                    <label>
                      Passive:
                      <input
                        type="number"
                        min="0"
                        value={h.passiveHrs || ""}
                        onChange={(e) =>
                          handleInput(day, "passiveHrs", e.target.value)
                        }
                      />
                    </label>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Monthly */}
      {view === "month" && (
        <div className="monthly-view">
          <h2>Monthly Calendar</h2>
          <div className="monthly-totals">
            <p>Total: {monthlyTotal}</p>
            <p>Active: {monthlyActive}</p>
            <p>Passive: {monthlyPassive}</p>
          </div>
          <div className="month-controls">
            <button onClick={() => setMonthStart(addMonths(monthStart, -1))}>
              Previous Month
            </button>
            <span>
              {monthStart.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </span>
            <button onClick={() => setMonthStart(addMonths(monthStart, 1))}>
              Next Month
            </button>
          </div>

          <div className="yearly-total">
            <h3>Year {year} Totals</h3>
            <p>Total: {yearlyTotal}</p>
            <p>Active: {yearlyActive}</p>
            <p>Passive: {yearlyPassive}</p>
          </div>

          <div className="yearly-summary">
            <h3>Yearly Overview</h3>
            <table>
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Active</th>
                  <th>Passive</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {yearlyTotals.map((m) => (
                  <tr key={m.month}>
                    <td>{m.month}</td>
                    <td>{m.active}</td>
                    <td>{m.passive}</td>
                    <td>{m.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="month-days">
            {monthDays.map((day) => {
              const key = formatDate(day);
              const h = hours[key] || {};
              return (
                <li
                  key={key}
                  className={key === formatDate(new Date()) ? "today" : ""}
                >
                  {key}
                  <div className="day-input">
                    <label>
                      Active:
                      <input
                        type="number"
                        min="0"
                        value={h.activeHrs || ""}
                        onChange={(e) =>
                          handleInput(day, "activeHrs", e.target.value)
                        }
                      />
                    </label>
                    <label>
                      Passive:
                      <input
                        type="number"
                        min="0"
                        value={h.passiveHrs || ""}
                        onChange={(e) =>
                          handleInput(day, "passiveHrs", e.target.value)
                        }
                      />
                    </label>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
