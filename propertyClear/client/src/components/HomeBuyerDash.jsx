import React, { useState, useEffect } from 'react';
import FilterAndSort from './components/FilterAndSort';
import './App.css';

const HomeBuyerDash = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);

  useEffect(() => {
    fetch('/homebuyer/properties')
      .then((res) => res.json())
      .then((data) => {
        setProperties(data);
        setFilteredProperties(data);
      });
  }, []);

  return (
    <div className="homebuyer-dashboard">
      <h1>Home Buyer Dashboard</h1>
      <FilterAndSort
        properties={properties}
        setFilteredProperties={setFilteredProperties}
      />
      <div className="property-grid">
        {filteredProperties.map((property) => (
          <div className="property-card" key={property.id}>
            <div className="property-details">
              <h3 className="property-address">{property.address}</h3>
              <p>Mortgage: ${property.mortgageAmount}</p>
              <p>Liens: {property.liens.length}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeBuyerDash;
