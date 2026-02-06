import "./App.css";
import React from "react";
import { useState } from "react";

function App() {
  return (
    <div className="App">
      <h1>Hours Tracker</h1>
      <WeeklyHours />
    </div>
  );
}

function WeeklyHours() {
  const [hours, setHours] = useState(0);

  return (
    <div>
      <h2>Weekly Hours</h2>
      <span>Total Weekly Hours: {hours} </span>
      <button onClick={() => setHours(hours + 1)}>Add Hour</button>
    </div>
  );
}

export default App;
