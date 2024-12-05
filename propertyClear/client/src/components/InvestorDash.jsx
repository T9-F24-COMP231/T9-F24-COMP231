import React, { useState, useEffect } from "react";

const Investor = () => {
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

  const generateReport = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/generate-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ properties }),
      });

      const result = await response.json();
      if (result.success) {
        window.open(result.filePath, '_blank');
      } else {
        alert('Failed to generate report');
      }
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  return (
    <div className="investor-dashboard">
      <div className="dashboard-header">
        <h1>Investor Property Portfolio</h1>
        <button onClick={generateReport} className="generate-report-btn">
          Generate Report
        </button>
      </div>

      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading property data...</p>
        </div>
      ) : (
        <div className="property-table-container">
          <PropertyTable properties={properties} />
        </div>
      )}
    </div>
  );
};

const PropertyTable = ({ properties }) => (
  <div className="table-wrapper">
    <table className="property-table">
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
          <tr key={property._id} className="property-row">
            <td>{property._id}</td>
            <td>{property.address}</td>
            <td>{property.owner_id}</td>
            <td className="info-cell">
              {property.liens && property.liens.length > 0 ? (
                property.liens.map((lien, index) => (
                  <div key={index} className="info-card">
                    <div className="info-header">Lien {index + 1}</div>
                    <div className="info-content">
                      <p><span>Date:</span> {lien.date}</p>
                      <p><span>Type:</span> {lien.type}</p>
                      <p><span>Amount:</span> ${lien.amount}</p>
                      <p><span>From:</span> {lien.partyFrom}</p>
                      <p><span>To:</span> {lien.partyTo}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-data">No Liens</div>
              )}
            </td>
            <td className="info-cell">
              {property.mortgages && property.mortgages.length > 0 ? (
                property.mortgages.map((mortgage, index) => (
                  <div key={index} className="info-card">
                    <div className="info-header">Mortgage {index + 1}</div>
                    <div className="info-content">
                      <p><span>Amount:</span> ${mortgage.amount}</p>
                      <p><span>Rate:</span> {mortgage.interestRate}%</p>
                      <p><span>Lender:</span> {mortgage.lender}</p>
                      <p><span>Start:</span> {mortgage.startDate}</p>
                      <p><span>End:</span> {mortgage.endDate}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-data">No Mortgages</div>
              )}
            </td>
            <td className="info-cell">
              {property.registeredinterests && property.registeredinterests.length > 0 ? (
                property.registeredinterests.map((interest, index) => (
                  <div key={index} className="info-card">
                    <div className="info-header">Interest {index + 1}</div>
                    <div className="info-content">
                      <p><span>Type:</span> {interest.type}</p>
                      <p><span>Amount:</span> ${interest.amount}</p>
                      <p><span>From:</span> {interest.partyFrom}</p>
                      <p><span>To:</span> {interest.partyTo}</p>
                      <p><span>Priority:</span> {interest.priority}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-data">No Registered Interests</div>
              )}
            </td>
            <td className="info-cell">
              {property.taxinfo && property.taxinfo.map((tax, index) => (
                <div key={index} className="info-card">
                  <div className="info-header">Tax Info {index + 1}</div>
                  <div className="info-content">
                    <p><span>Tax ID:</span> {tax.tax_id}</p>
                    <p><span>Final Levies:</span> ${tax.finalLevies}</p>
                    <p><span>Interim Billing:</span> ${tax.lessInterimBilling}</p>
                    <p><span>Amount Due:</span> ${tax.totalAmountDue}</p>
                    <p><span>Due Date:</span> {tax.dueDate}</p>
                  </div>
                </div>
              ))}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default Investor;