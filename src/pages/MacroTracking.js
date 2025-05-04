import React, { useState, useEffect } from "react";
import { Line, Pie } from "react-chartjs-2";
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
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const MacroTracking = () => {
  const [lineChartData, setLineChartData] = useState(null);
  const [pieChartData, setPieChartData] = useState(null);

  useEffect(() => {
    const fetchMacroData = async () => {
      try {
        const email = JSON.parse(localStorage.getItem("user"))?.email || "testuser@example.com";
        const response = await axios.get("${process.env.REACT_APP_API_URL}/api/nutrition/macros", {
          params: { email },
        });

        // Aggregate data by day
        const aggregatedData = response.data.reduce((acc, meal) => {
          const date = new Date(meal.date).toLocaleDateString(); // Format date as MM/DD/YYYY
          if (!acc[date]) {
            acc[date] = { protein: 0, carbs: 0, fat: 0 };
          }
          acc[date].protein += meal.macros.protein;
          acc[date].carbs += meal.macros.carbs;
          acc[date].fat += meal.macros.fat;
          return acc;
        }, {});

        // Sort the aggregated data by date
        const sortedDates = Object.keys(aggregatedData).sort((a, b) => {
          const dateA = new Date(a);
          const dateB = new Date(b);
          return dateA - dateB; // Sort in ascending order
        });

        // Prepare data for the line chart
        const labels = sortedDates; // Sorted dates
        const protein = labels.map((date) => aggregatedData[date].protein);
        const carbs = labels.map((date) => aggregatedData[date].carbs);
        const fat = labels.map((date) => aggregatedData[date].fat);

        setLineChartData({
          labels,
          datasets: [
            {
              label: "Protein (g)",
              data: protein,
              borderColor: "rgba(54, 162, 235, 1)",
              backgroundColor: "rgba(54, 162, 235, 0.2)",
              tension: 0.4,
            },
            {
              label: "Carbs (g)",
              data: carbs,
              borderColor: "rgba(75, 192, 192, 1)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              tension: 0.4,
            },
            {
              label: "Fat (g)",
              data: fat,
              borderColor: "rgba(255, 206, 86, 1)",
              backgroundColor: "rgba(255, 206, 86, 0.2)",
              tension: 0.4,
            },
          ],
        });

        // Calculate total macros for the pie chart
        const totalProtein = protein.reduce((sum, value) => sum + value, 0);
        const totalCarbs = carbs.reduce((sum, value) => sum + value, 0);
        const totalFat = fat.reduce((sum, value) => sum + value, 0);

        setPieChartData({
          labels: ["Protein", "Carbs", "Fat"],
          datasets: [
            {
              data: [totalProtein, totalCarbs, totalFat],
              backgroundColor: [
                "rgba(54, 162, 235, 0.6)", // Protein
                "rgba(75, 192, 192, 0.6)", // Carbs
                "rgba(255, 206, 86, 0.6)", // Fat
              ],
              borderColor: [
                "rgba(54, 162, 235, 1)", // Protein
                "rgba(75, 192, 192, 1)", // Carbs
                "rgba(255, 206, 86, 1)", // Fat
              ],
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching macro data:", error);
      }
    };

    fetchMacroData();
  }, []);

  return (
    <div style={{ maxWidth: "800px", margin: "50px auto", textAlign: "center" }}>
      <h2>Macro Tracking</h2>
      {lineChartData ? (
        <Line
          data={lineChartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                display: true,
                position: "top",
              },
              title: {
                display: true,
                text: "Macros Over Time",
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
                  text: "Grams",
                },
              },
            },
          }}
        />
      ) : (
        <p>Loading line chart...</p>
      )}

      <h2 style={{ marginTop: "50px" }}>Macro Distribution</h2>
      {pieChartData ? (
        <Pie
          data={pieChartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                display: true,
                position: "top",
              },
              title: {
                display: true,
                text: "Macro Distribution",
              },
            },
          }}
          style={{ width: "600px", height: "600px", margin: "0 auto" }}
        />
      ) : (
        <p>Loading pie chart...</p>
      )}
    </div>
  );
};

export default MacroTracking;
