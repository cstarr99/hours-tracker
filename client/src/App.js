import "./App.css";
import React from "react";
import { useState } from "react";

function App() {
  return (
    <div className="App">
      <h1>Hours Tracker</h1>
      <WeeklyHours />
      <MonthlyHours />
    </div>
  );
}

function WeeklyHours() {
  const [weeklyActHours, setWeeklyActHours] = useState(0);
  const [weeklyPasHours, setWeeklyPasHours] = useState(0);

  return (
    <div>
      <h2>Weekly Hours</h2>
      <span>Total Weekly Hours: {weeklyActHours + weeklyPasHours} </span>

      <h2>Weekly Hours</h2>
      <span>Total Weekly Active Hours: {weeklyActHours} </span>
      <button onClick={() => setWeeklyActHours(weeklyActHours + 1)}>
        Add Hour
      </button>

      <h2>Weekly Hours</h2>
      <span>Total Weekly Passive Hours: {weeklyPasHours} </span>
      <button onClick={() => setWeeklyPasHours(weeklyPasHours + 1)}>
        Add Hour
      </button>
    </div>
  );
}

function MonthlyHours() {
  const [monthlyActHours, setMonthlyActHours] = useState(0);
  const [monthlyPasHours, setMonthlyPasHours] = useState(0);

  return (
    <div>
      <h2>Monthly Hours</h2>
      <span>Total Weekly Hours: {monthlyActHours + monthlyPasHours} </span>

      <h2>Monthly Hours</h2>
      <span>Total Weekly Active Hours: {monthlyActHours} </span>
      <button onClick={() => setMonthlyActHours(monthlyActHours + 1)}>
        Add Hour
      </button>

      <h2>Monthly Hours</h2>
      <span>Total Weekly Passive Hours: {monthlyPasHours} </span>
      <button onClick={() => setMonthlyPasHours(monthlyPasHours + 1)}>
        Add Hour
      </button>
    </div>
  );
}

export default App;
