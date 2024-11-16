import React from "react";

const HistoricalData = ({ history }) => {
  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>Historical Data</h2>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ccc", padding: "10px" }}>Date</th>
            <th style={{ border: "1px solid #ccc", padding: "10px" }}>Event</th>
            <th style={{ border: "1px solid #ccc", padding: "10px" }}>Details</th>
          </tr>
        </thead>
        <tbody>
          {history.map((item, index) => (
            <tr key={index}>
              <td style={{ border: "1px solid #ccc", padding: "10px" }}>{item.date}</td>
              <td style={{ border: "1px solid #ccc", padding: "10px" }}>{item.event}</td>
              <td style={{ border: "1px solid #ccc", padding: "10px" }}>{item.details}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HistoricalData;
