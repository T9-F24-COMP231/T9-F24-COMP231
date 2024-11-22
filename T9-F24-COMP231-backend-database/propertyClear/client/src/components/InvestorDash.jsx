import React from "react";
// import axios from 'axios';
import { useState } from "react";
import "../assets/styles/table.css";


const Investor = () => {

    const [properties, setProperties] = useState([]);

    // useEffect(() => {
    //   const fetchProperties = async () => {
    //     try {
    //       const response = await axios.get('/api/properties'); // Adjust to your API endpoint
    //       setProperties(response.data);
    //     } catch (error) {
    //       console.error("Error fetching properties", error);
    //     }
    //   };
    //   fetchProperties();
    // }, []);
  
    return (
        <div className="investor_component">
            <h2>Investor - Property Data</h2>
            <PropertyTable properties={properties} />
        </div>
    )
};

const PropertyTable = ({ properties }) => (
    <table>
      <thead>
        <tr>
          <th>Property ID</th>
          <th>Address</th>
          <th>Owner</th>
          <th>Value</th>
          <th>Tax Status</th>
          <th>Other Info</th>
        </tr>
      </thead>
      <tbody>
        {properties.map((property) => (
          <tr key={property.id}>
            <td>{property.id}</td>
            <td>{property.address}</td>
            <td>{property.owner}</td>
            <td>{property.value}</td>
            <td>{property.taxStatus}</td>
            <td>{property.otherInfo}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

export default Investor