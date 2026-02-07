import "./App.css";
import React from "react";
import { useState } from "react";

/* ---------- Date helpers ---------- */

// Monday start
function startOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date, months) {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

function daysInMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

/* ---------- APP ---------- */
function App() {
  /* Weekly state */
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date()));

  const weekDays = [...Array(7)].map((_, i) => addDays(weekStart, i));

  /* Monthly state */
  const [monthStart, setMonthStart] = useState(startOfMonth(new Date()));

  const monthDays = [...Array(daysInMonth(monthStart))].map(
    (_, i) => new Date(monthStart.getFullYear(), monthStart.getMonth(), i + 1)
  );

  return (
    <div>
      {/* -------- Weekly Calendar -------- */}
      <h2>Weekly Calendar</h2>

      <button onClick={() => setWeekStart(addDays(weekStart, -7))}>
        Previous Week
      </button>

      <span>
        {weekStart.toDateString()} – {addDays(weekStart, 6).toDateString()}
      </span>

      <button onClick={() => setWeekStart(addDays(weekStart, 7))}>
        Next Week
      </button>

      <ul>
        {weekDays.map((day) => (
          <li key={day.toISOString()}>{day.toDateString()}</li>
        ))}
      </ul>

      <hr />

      {/* -------- Monthly Calendar -------- */}
      <h2>Monthly Calendar</h2>

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

      <ul>
        {monthDays.map((day) => (
          <li key={day.toISOString()}>{day.toDateString()}</li>
        ))}
      </ul>
    </div>
  );
}

// function App() {
//   return (
//     <div className="App">
//       <h1>Hours Tracker</h1>
//       <WeeklyHours />
//       <MonthlyHours />
//     </div>
//   );
// }

// function WeeklyHours() {
//   const [weeklyActHours, setWeeklyActHours] = useState(0);
//   const [weeklyPasHours, setWeeklyPasHours] = useState(0);

//   return (
//     <div>
//       <h2>Weekly Hours</h2>
//       <span>Total Weekly Hours: {weeklyActHours + weeklyPasHours} </span>

//       <h2>Weekly Hours</h2>
//       <span>Total Weekly Active Hours: {weeklyActHours} </span>
//       <button onClick={() => setWeeklyActHours(weeklyActHours + 1)}>
//         Add Hour
//       </button>

//       <h2>Weekly Hours</h2>
//       <span>Total Weekly Passive Hours: {weeklyPasHours} </span>
//       <button onClick={() => setWeeklyPasHours(weeklyPasHours + 1)}>
//         Add Hour
//       </button>
//     </div>
//   );
// }

// function MonthlyHours() {
//   const [monthlyActHours, setMonthlyActHours] = useState(0);
//   const [monthlyPasHours, setMonthlyPasHours] = useState(0);

//   return (
//     <div>
//       <h2>Monthly Hours</h2>
//       <span>Total Weekly Hours: {monthlyActHours + monthlyPasHours} </span>

//       <h2>Monthly Hours</h2>
//       <span>Total Weekly Active Hours: {monthlyActHours} </span>
//       <button onClick={() => setMonthlyActHours(monthlyActHours + 1)}>
//         Add Hour
//       </button>

//       <h2>Monthly Hours</h2>
//       <span>Total Weekly Passive Hours: {monthlyPasHours} </span>
//       <button onClick={() => setMonthlyPasHours(monthlyPasHours + 1)}>
//         Add Hour
//       </button>
//     </div>
//   );
// }

export default App;
