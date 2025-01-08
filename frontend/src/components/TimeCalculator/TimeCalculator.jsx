import React, { useState } from "react";

function TimeAddingCalculator() {
  const [time1, setTime1] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [time2, setTime2] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [result, setResult] = useState({ hours: 0, minutes: 0, seconds: 0 });

  // Function to handle time addition
  const handleAddTimes = () => {
    let totalHours = time1.hours + time2.hours;
    let totalMinutes = time1.minutes + time2.minutes;
    let totalSeconds = time1.seconds + time2.seconds;

    // If seconds exceed 60, convert to minutes
    if (totalSeconds >= 60) {
      totalSeconds -= 60;
      totalMinutes += 1;
    }

    // If minutes exceed 60, convert to hours
    if (totalMinutes >= 60) {
      totalMinutes -= 60;
      totalHours += 1;
    }

    setResult({ hours: totalHours, minutes: totalMinutes, seconds: totalSeconds });
  };

  // Function to update time 1
  const handleTime1Change = (e) => {
    const { name, value } = e.target;
    setTime1((prev) => ({ ...prev, [name]: value }));
  };

  // Function to update time 2
  const handleTime2Change = (e) => {
    const { name, value } = e.target;
    setTime2((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Time Adding Calculator</h1>

      <div style={styles.timeInputContainer}>
        <div style={styles.timeInputBox}>
          <h3>Enter Time 1</h3>
          <label style={styles.label}>
            Hours:
            <input
              type="number"
              name="hours"
              value={time1.hours}
              onChange={handleTime1Change}
              min="0"
              style={styles.input}
            />
          </label>
          <label style={styles.label}>
            Minutes:
            <input
              type="number"
              name="minutes"
              value={time1.minutes}
              onChange={handleTime1Change}
              min="0"
              max="59"
              style={styles.input}
            />
          </label>
          <label style={styles.label}>
            Seconds:
            <input
              type="number"
              name="seconds"
              value={time1.seconds}
              onChange={handleTime1Change}
              min="0"
              max="59"
              style={styles.input}
            />
          </label>
        </div>

        <div style={styles.timeInputBox}>
          <h3>Enter Time 2</h3>
          <label style={styles.label}>
            Hours:
            <input
              type="number"
              name="hours"
              value={time2.hours}
              onChange={handleTime2Change}
              min="0"
              style={styles.input}
            />
          </label>
          <label style={styles.label}>
            Minutes:
            <input
              type="number"
              name="minutes"
              value={time2.minutes}
              onChange={handleTime2Change}
              min="0"
              max="59"
              style={styles.input}
            />
          </label>
          <label style={styles.label}>
            Seconds:
            <input
              type="number"
              name="seconds"
              value={time2.seconds}
              onChange={handleTime2Change}
              min="0"
              max="59"
              style={styles.input}
            />
          </label>
        </div>
      </div>

      <button onClick={handleAddTimes} style={styles.button}>
        Add Times
      </button>

      <div style={styles.result}>
        <h3>Result</h3>
        <p>
          Total Time: {result.hours} hour(s), {result.minutes} minute(s), and{" "}
          {result.seconds} second(s)
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    backgroundColor: "#f4f4f9",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    width: "400px",
    margin: "auto",
  },
  header: {
    fontSize: "24px",
    color: "#333",
    marginBottom: "20px",
  },
  timeInputContainer: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
  },
  timeInputBox: {
    display: "flex",
    flexDirection: "column",
    width: "45%",
  },
  label: {
    marginBottom: "10px",
    fontSize: "16px",
    color: "#555",
  },
  input: {
    padding: "5px",
    fontSize: "16px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    marginBottom: "10px",
  },
  button: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
    marginTop: "20px",
  },
  buttonHover: {
    backgroundColor: "#45a049",
  },
  result: {
    marginTop: "20px",
    fontSize: "18px",
    color: "#333",
  },
};

export default TimeAddingCalculator;
