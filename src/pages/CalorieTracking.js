import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const CalorieTracking = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchCalorieData = async () => {
      try {
        const email = JSON.parse(localStorage.getItem("user"))?.email || "testuser@example.com";
        const response = await axios.get("http://localhost:5001/api/nutrition/macros", {
          params: { email },
        });

        // Aggregate data by day
        const aggregatedData = response.data.reduce((acc, meal) => {
          const date = new Date(meal.date).toLocaleDateString(); // Format date as MM/DD/YYYY
          if (!acc[date]) {
            acc[date] = 0;
          }
          acc[date] += meal.macros.calories;
          return acc;
        }, {});

        // Sort the aggregated data by date
        const sortedDates = Object.keys(aggregatedData).sort((a, b) => {
          const dateA = new Date(a);
          const dateB = new Date(b);
          return dateA - dateB; // Sort in ascending order
        });

        // Prepare data for the chart
        const labels = sortedDates; // Sorted dates
        const calories = labels.map((date) => aggregatedData[date]);

        setChartData({
          labels,
          datasets: [
            {
              label: "Calories Over Time",
              data: calories,
              borderColor: "rgba(255, 99, 132, 1)",
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              tension: 0.4,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching calorie data:", error);
      }
    };

    fetchCalorieData();
  }, []);

  return (
    <div style={{ maxWidth: "800px", margin: "50px auto", textAlign: "center" }}>
      <h2>Calorie Tracking</h2>
      {chartData ? (
        <Line
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
                text: "Calories Over Time",
              },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: "Date",
                },
              },
              y: {
                title: {
                  display: true,
                  text: "Calories",
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

export default CalorieTracking;