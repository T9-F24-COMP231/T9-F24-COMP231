import React, { useEffect, useState } from "react";

const Main = () => {
    const [properties, setProperties] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await fetch('http://localhost:5001/properties', {
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

    const filteredProperties = properties.filter(property =>
        property.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="property-dashboard">
            <div className="dashboard-header">
                <h1 className="text-3xl font-bold text-gray-800">Property Dashboard</h1>
                <p className="text-gray-600 mt-2">Manage and search your property listings</p>
            </div>

            <div className="search-container">
                <div className="search-wrapper">
                    <span className="search-icon">🔍</span>
                    <input
                        type="text"
                        placeholder="Search properties by address..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>
            </div>

            <div className="properties-section">
                <div className="properties-header">
                    <h2 className="text-xl font-semibold text-gray-800">Property Listings</h2>
                    {!isLoading && properties.length > 0 && (
                        <span className="property-count">
                            {filteredProperties.length} of {properties.length} properties
                        </span>
                    )}
                </div>

                {isLoading ? (
                    <div className="loading-state">
                        <div className="loading-spinner"></div>
                        <p>Loading properties...</p>
                    </div>
                ) : filteredProperties.length === 0 ? (
                    <div className="empty-state">
                        {properties.length === 0 ? (
                            <p>No properties found in the database.</p>
                        ) : (
                            <p>No properties match your search criteria.</p>
                        )}
                    </div>
                ) : (
                    <div className="property-grid">
                        {filteredProperties.map((property, index) => (
                            <div key={index} className="property-card">
                                <div className="property-image"></div>
                                <div className="property-details">
                                    <h3 className="property-address">{property.address}</h3>
                                    <button className="view-details-btn">View Details</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Main;