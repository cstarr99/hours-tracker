import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:5000/api/hours";

// DATE HELPERS
const dateKey = (date) => date.toISOString().split("T")[0];
const startOfWeek = (date) => {
  const d = new Date(date);
  const day = d.getUTCDay();
  const diff = d.getUTCDate() - day + (day === 0 ? -6 : 1);
  d.setUTCDate(diff);
  d.setUTCHours(0, 0, 0, 0);
  return d;
};
const addDays = (date, days) => {
  const d = new Date(date);
  d.setUTCDate(d.getUTCDate() + days);
  return d;
};
const startOfMonth = (date) =>
  new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
const addMonths = (date, months) =>
  new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + months, 1));
const daysInMonth = (date) =>
  new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)
  ).getUTCDate();

// APP
function App() {
  const [view, setView] = useState("week");
  const [hours, setHours] = useState({});

  // FETCH DATA
  useEffect(() => {
    axios
      .get(API_URL)
      .then((res) => {
        const map = {};
        res.data.data.allHours.forEach((log) => {
          const key = log.date.split("T")[0];
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

  //WEEKLY STATE
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date()));
  const weekDays = [...Array(7)].map((_, i) => addDays(weekStart, i));

  // MONTHLY STATE
  const [monthStart, setMonthStart] = useState(startOfMonth(new Date()));
  const monthDays = [...Array(daysInMonth(monthStart))].map(
    (_, i) =>
      new Date(
        Date.UTC(monthStart.getUTCFullYear(), monthStart.getUTCMonth(), i + 1)
      )
  );

  // HANDLE INPUT
  const handleInput = async (day, field, value) => {
    const key = dateKey(day);
    const num = Number(value);
    const existing = hours[key];

    if (!existing) {
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
    } else {
      const updated = { ...existing, [field]: num };
      await axios.patch(`${API_URL}/${existing.id}`, updated);
      setHours((prev) => ({ ...prev, [key]: updated }));
    }
  };

  //TOTAL CALCULATIONS
  const sum = (days, field) =>
    days.reduce((acc, d) => acc + (hours[dateKey(d)]?.[field] || 0), 0);

  const weeklyActive = sum(weekDays, "activeHrs");
  const weeklyPassive = sum(weekDays, "passiveHrs");
  const weeklyTotal = weeklyActive + weeklyPassive;

  const monthlyActive = sum(monthDays, "activeHrs");
  const monthlyPassive = sum(monthDays, "passiveHrs");
  const monthlyTotal = monthlyActive + monthlyPassive;

  const year = monthStart.getUTCFullYear();
  const yearlyTotals = [...Array(12)].map((_, m) => {
    const start = new Date(Date.UTC(year, m, 1));
    const days = [...Array(daysInMonth(start))].map(
      (_, i) => new Date(Date.UTC(year, m, i + 1))
    );
    const active = sum(days, "activeHrs");
    const passive = sum(days, "passiveHrs");
    return {
      month: start.toLocaleString("default", { month: "short" }),
      active,
      passive,
      total: active + passive,
    };
  });

  const yearlyActive = yearlyTotals.reduce((a, m) => a + m.active, 0);
  const yearlyPassive = yearlyTotals.reduce((a, m) => a + m.passive, 0);
  const yearlyTotal = yearlyActive + yearlyPassive;

  // UI
  return (
    <div className="App">
      <h1>Hours Tracker</h1>

      {/* Toggle view */}
      <div className="toggle-buttons">
        <button
          className={view === "week" ? "active" : ""}
          onClick={() => setView("week")}
        >
          Weekly View
        </button>
        <button
          className={view === "month" ? "active" : ""}
          onClick={() => setView("month")}
        >
          Monthly View
        </button>
      </div>

      {/* ---------- WEEKLY ---------- */}
      {view === "week" && (
        <div className="weekly-view">
          <h2>Weekly Calendar</h2>
          <div className="weekly-totals">
            <p>Total Hours: {weeklyTotal}</p>
            <p>Active: {weeklyActive}</p>
            <p>Passive: {weeklyPassive}</p>
          </div>
          <div className="week-controls">
            <button onClick={() => setWeekStart(addDays(weekStart, -7))}>
              Previous Week
            </button>
            <span>
              {weekStart.toDateString()} –{" "}
              {addDays(weekStart, 6).toDateString()}
            </span>
            <button onClick={() => setWeekStart(addDays(weekStart, 7))}>
              Next Week
            </button>
          </div>
          <ul className="week-days">
            {weekDays.map((d) => {
              const key = dateKey(d);
              const h = hours[key] || {};
              return (
                <li
                  key={key}
                  className={key === dateKey(new Date()) ? "today" : ""}
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
                          handleInput(d, "activeHrs", e.target.value)
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
                          handleInput(d, "passiveHrs", e.target.value)
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

      {/* ---------- MONTHLY ---------- */}
      {view === "month" && (
        <div className="monthly-view">
          <h2>Monthly Calendar</h2>
          <div className="monthly-totals">
            <p>Total Hours: {monthlyTotal}</p>
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
            <p>Total Hours: {yearlyTotal}</p>
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
            {monthDays.map((d) => {
              const key = dateKey(d);
              const h = hours[key] || {};
              return (
                <li
                  key={key}
                  className={key === dateKey(new Date()) ? "today" : ""}
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
                          handleInput(d, "activeHrs", e.target.value)
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
                          handleInput(d, "passiveHrs", e.target.value)
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
