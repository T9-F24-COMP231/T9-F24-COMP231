import React, { useState, useEffect } from "react";
import "../assets/styles/table.css";

const Investor = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('http://localhost:5001/propertiesSecure', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setProperties(data);
        setFilteredProperties(data); // Initialize filtered properties
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching properties:', error);
        setIsLoading(false);
      }
    };

    fetchProperties(); 
  }, []);

  return (
    <div className="investor_component">
      <h2>Investor - Property Data</h2>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          {/* Filter and Sort Component */}
          <FilterAndSort
            properties={properties}
            setFilteredProperties={setFilteredProperties}
          />
          {/* Property Table */}
          <PropertyTable properties={filteredProperties} />
        </>
      )}
    </div>
  );
};

// Filter and Sort Component
const FilterAndSort = ({ properties, setFilteredProperties }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('');

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = properties.filter((property) =>
      property.address.toLowerCase().includes(query)
    );
    setFilteredProperties(filtered);
  };

  const handleSort = (e) => {
    const option = e.target.value;
    setSortOption(option);

    let sorted = [...properties];
    if (option === 'amountAsc') {
      sorted.sort((a, b) => {
        const aAmount = a.liens?.[0]?.amount || 0;
        const bAmount = b.liens?.[0]?.amount || 0;
        return aAmount - bAmount;
      });
    } else if (option === 'amountDesc') {
      sorted.sort((a, b) => {
        const aAmount = a.liens?.[0]?.amount || 0;
        const bAmount = b.liens?.[0]?.amount || 0;
        return bAmount - aAmount;
      });
    } else if (option === 'dateAsc') {
      sorted.sort((a, b) => {
        const aDate = new Date(a.liens?.[0]?.date || '1970-01-01');
        const bDate = new Date(b.liens?.[0]?.date || '1970-01-01');
        return aDate - bDate;
      });
    } else if (option === 'dateDesc') {
      sorted.sort((a, b) => {
        const aDate = new Date(a.liens?.[0]?.date || '1970-01-01');
        const bDate = new Date(b.liens?.[0]?.date || '1970-01-01');
        return bDate - aDate;
      });
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
        <option value="amountAsc">Lien Amount (Low to High)</option>
        <option value="amountDesc">Lien Amount (High to Low)</option>
        <option value="dateAsc">Lien Date (Oldest to Newest)</option>
        <option value="dateDesc">Lien Date (Newest to Oldest)</option>
      </select>
    </div>
  );
};

// Property Table Component
const PropertyTable = ({ properties }) => (
  <table>
    <thead>
      <tr>
        <th>Property ID</th>
        <th>Address</th>
        <th>Owner ID</th>
        <th>Liens</th>
        <th>Mortgages</th>
        <th>Registered Interests</th>
        <th>Tax Information</th>
      </tr>
    </thead>
    <tbody>
      {properties.map((property) => (
        <tr key={property._id}>
          <td>{property._id}</td>
          <td>{property.address}</td>
          <td>{property.owner_id}</td>
          <td>
            {property.liens && property.liens.length > 0
              ? property.liens.map((lien, index) => (
                <div key={index} className="columns">
                  <p>Date: {lien.date}</p>
                  <p>Type: {lien.type}</p>
                  <p>Amount: ${lien.amount}</p>
                  <p>Party from: {lien.partyFrom}</p>
                  <p>Party to: {lien.partyTo}</p>
                </div>
              ))
              : "No Liens"}
          </td>
          <td>
            {/* Mortgages */}
            {property.mortgages && property.mortgages.length > 0
              ? property.mortgages.map((mortgage, index) => (
                <div key={index} className="columns">
                  <p>Amount: {mortgage.amount}</p>
                  <p>Rate: {mortgage.interestRate}</p>
                  <p>Lender: {mortgage.lender}</p>
                  <p>Start date: {mortgage.startDate}</p>
                  <p>End date: {mortgage.endDate}</p>
                </div>
              ))
              : "No Mortgages"}
          </td>
          <td>
            {/* Registered Interests */}
            {property.registeredinterests && property.registeredinterests.length > 0
              ? property.registeredinterests.map((interest, index) => (
                <div key={index} className="columns">
                  <p>Type: {interest.type}</p>
                  <p>Amount: {interest.amount}</p>
                  <p>Party from: {interest.partyFrom}</p>
                  <p>Party to: {interest.partyTo}</p>
                  <p>Priority: {interest.priority}</p>
                </div>
              ))
              : "No Registered Interests"}
          </td>
          <td>
            {/* Tax Information */}
            {property.taxinfo &&
              property.taxinfo.map((tax, index) => (
                <div key={index} className="columns">
                  <p>Tax ID: {tax.tax_id}</p>
                  <p>Final Levies: {tax.finalLevies}</p>
                  <p>Less Interim Billing: {tax.lessInterimBilling}</p>
                  <p>Total Amount Due: {tax.totalAmountDue}</p>
                  <p>Due Date: {tax.dueDate}</p>
                </div>
              ))}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default Investor;
