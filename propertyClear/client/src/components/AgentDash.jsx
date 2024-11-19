import React, { useState, useEffect } from "react";
import "../assets/styles/table.css";

const Agent = () => {
  const [properties, setProperties] = useState([]);
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
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching properties:', error);
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, []);

  return (
    <div className="agent_component">
      <h2>Real Estate Agent - Property Data</h2>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <PropertyTable properties={properties} />
      )}
    </div>
  );
};

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
                  <p>Data: {lien.date}</p>
                  <p>Type: {lien.type}</p>
                  <p>Amount: ${lien.amount}</p>
                  <p>Party from: {lien.partyFrom}</p>
                  <p>Party to: {lien.partyTo}</p>
                </div>
              ))
              : "No Liens"}
          </td>

          <td>
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
export default Agent