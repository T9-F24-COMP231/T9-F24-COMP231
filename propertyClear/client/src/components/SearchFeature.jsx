import React, { useState } from "react";

const SearchValidation = ({ onSearch }) => {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const validateInput = (value) => {
    if (!value.trim()) {
      return "Input cannot be empty.";
    }
    if (!/^\d{3,}-?\d{0,}$|^\w+$/i.test(value)) {
      return "Enter a valid property ID or address.";
    }
    return "";
  };

  const handleSearch = () => {
    const validationError = validateInput(input);
    if (validationError) {
      setError(validationError);
    } else {
      setError("");
      onSearch(input);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter Property ID or Address"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default SearchValidation;
