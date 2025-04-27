import React, { useState, useEffect } from "react";
import { Scatter } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import "chartjs-adapter-date-fns"; // Adapter for date formatting

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  TimeScale // Register TimeScale for date handling
);

const WeightTracking = () => {
  const [chartData, setChartData] = useState(null);
  const [weight, setWeight] = useState("");
  const [weightGoal, setWeightGoal] = useState(null); // State for weight goal
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchWeightData = async () => {
      try {
        const userId = JSON.parse(localStorage.getItem("user"))?.id;

        // Fetch weight history
        const weightResponse = await axios.get("http://localhost:5001/api/weight", {
          params: { userId },
        });

        const history = weightResponse.data;

        // Fetch user data to get the weight goal
        const userResponse = await axios.get(`http://localhost:5001/api/auth/user/${userId}`);
        const user = userResponse.data;

        setWeightGoal(user.weightGoal || null); // Set weight goal from user profile

        // Prepare data for the scatter plot
        const dataPoints = history.map((entry) => ({
          x: new Date(entry.date), // Use Date object for proper time handling
          y: entry.weight,
        }));

        setChartData({
          datasets: [
            {
              label: "Weight",
              data: dataPoints,
              backgroundColor: "rgba(75, 192, 192, 1)",
              borderColor: "rgba(75, 192, 192, 1)",
              pointRadius: 5,
            },
            ...(user.weightGoal
              ? [
                  {
                    label: "Weight Goal",
                    data: [
                      { x: dataPoints[0]?.x, y: user.weightGoal },
                      { x: dataPoints[dataPoints.length - 1]?.x, y: user.weightGoal },
                    ],
                    borderColor: "rgba(255, 99, 132, 1)", // Red color for the line
                    borderWidth: 2,
                    pointRadius: 0, // No points for the line
                    type: "line", // Ensure it's a line
                  },
                ]
              : []),
          ],
        });
      } catch (error) {
        console.error("Error fetching weight data:", error);
      }
    };

    fetchWeightData();
  }, []);

  const handleLogWeight = async (e) => {
    e.preventDefault();
    try {
      const userId = JSON.parse(localStorage.getItem("user"))?.id;
      const response = await axios.post("http://localhost:5001/api/weight/log", {
        userId,
        weight,
      });
      setMessage(response.data.message);
      setWeight("");
    } catch (error) {
      console.error("Error logging weight:", error);
      setMessage("Failed to log weight. Please try again.");
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "50px auto", textAlign: "center" }}>
      <h2>Weight Tracking</h2>
      <p style={{ fontStyle: "italic", color: "gray" }}>
        Tip: It's best to log your weight once a week to avoid unnecessary stress.
      </p>
      <form onSubmit={handleLogWeight} style={{ marginBottom: "20px" }}>
        <input
          type="number"
          placeholder="Enter your weight (lbs)"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          required
        />
        <button type="submit">Log Weight</button>
      </form>
      {message && <p>{message}</p>}
      {chartData ? (
        <Scatter
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                display: true,
                position: "top",
              },
              title: {
                display: true,
                text: "Weight Over Time",
              },
            },
            scales: {
              x: {
                type: "time", // Use time scale for X-axis
                time: {
                  unit: "day", // Display dates by day
                  tooltipFormat: "PP", // Format for tooltips (e.g., Apr 25, 2025)
                  displayFormats: {
                    day: "MMM d", // Format for X-axis labels (e.g., Apr 25)
                  },
                },
                title: {
                  display: true,
                  text: "Date",
                },
              },
              y: {
                title: {
                  display: true,
                  text: "Weight (lbs)",
                },
              },
            },
          }}
        />
      ) : (
        <p>Loading chart...</p>
      )}
    </div>
  );
};

export default WeightTracking;