import React, { useState } from "react";
import Chart from "chart.js/auto"; // Assuming you use Chart.js

const DynamicGraph = ({ data }) => {
  const [filter, setFilter] = useState("all");

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const filteredData = filter === "all" ? data : data.filter((d) => d.category === filter);

  const chartRef = React.useRef(null);

  React.useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    const chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: filteredData.map((d) => d.label),
        datasets: [
          {
            label: "Filtered Data",
            data: filteredData.map((d) => d.value),
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      },
    });

    return () => chart.destroy();
  }, [filteredData]);

  return (
    <div>
      <select onChange={handleFilterChange}>
        <option value="all">All</option>
        <option value="category1">Category 1</option>
        <option value="category2">Category 2</option>
      </select>
      <canvas ref={chartRef} />
    </div>
  );
};

export default DynamicGraph;
