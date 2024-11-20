import React, { useState } from 'react';

const FilterAndSort = ({ properties, setFilteredProperties }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('');

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = properties.filter((prop) =>
      prop.address.toLowerCase().includes(query)
    );
    setFilteredProperties(filtered);
  };

  const handleSort = (e) => {
    const option = e.target.value;
    setSortOption(option);

    let sorted = [...properties];
    if (option === 'amountAsc') {
      sorted.sort((a, b) => a.mortgageAmount - b.mortgageAmount);
    } else if (option === 'amountDesc') {
      sorted.sort((a, b) => b.mortgageAmount - a.mortgageAmount);
    }
    setFilteredProperties(sorted);
  };

  return (
    <div className="filter-sort-container">
      <input
        type="text"
        placeholder="Search by address"
        value={searchQuery}
        onChange={handleSearch}
        className="search-input"
      />
      <select
        value={sortOption}
        onChange={handleSort}
        className="sort-dropdown"
      >
        <option value="">Sort by</option>
        <option value="amountAsc">Mortgage Amount (Low to High)</option>
        <option value="amountDesc">Mortgage Amount (High to Low)</option>
      </select>
    </div>
  );
};

export default FilterAndSort;
