import React, { useState } from "react";

const SearchInterface = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchClick = () => {
    if (searchTerm.trim()) {
      onSearch(searchTerm);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>Search Properties</h2>
      <input
        type="text"
        placeholder="Search by Property ID or Address"
        value={searchTerm}
        onChange={handleSearchChange}
        style={{
          width: "300px",
          padding: "10px",
          marginRight: "10px",
          border: "1px solid #ccc",
        }}
      />
      <button
        onClick={handleSearchClick}
        style={{
          padding: "10px 20px",
          backgroundColor: "#007BFF",
          color: "#fff",
          border: "none",
          cursor: "pointer",
        }}
      >
        Search
      </button>
    </div>
  );
};

export default SearchInterface;
