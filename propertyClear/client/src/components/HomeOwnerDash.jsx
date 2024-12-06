import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Owner = () => {
    const [property, setProperty] = useState(null); // Store single property
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const fetchProperty = async () => {
            setIsLoading(true);
            try {
                // Extract user ID from the token
                const token = localStorage.getItem("authToken");
                const decodedToken = jwtDecode(token);
                const userId = decodedToken.id;

                console.log("Decoded Token:", decodedToken);
                console.log("Extracted User ID:", userId);

                const response = await fetch(`http://localhost:5001/propertiesSecure/owner`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch property");
                }

                const data = await response.json();
                console.log("Fetched property data:", data);

                // Ensure data[0] exists before accessing
                if (data && data.length > 0) {
                    setProperty(data[0]); // Extract the first property object
                } else {
                    setProperty(null); // Handle the case where no data is returned
                }
            } catch (error) {
                console.error("Error fetching property:", error);
                setProperty(null); // Set property to null on error
            } finally {
                setIsLoading(false);
            }
        };


        fetchProperty();
    }, [location]);

    return (
        <div className="owner_component">
            <h2>Home Owner - Property Information</h2>
            {isLoading ? (
                <div>Loading...</div>
            ) : property ? (
                <>
                    <PropertyTable property={property} />
                    <LienChart liens={property.liens} />
                </>
            ) : (
                <div>No property found for the user.</div>
            )}
        </div>
    );
};

const PropertyTable = ({ property }) => (
    <table>
        <thead>
            <tr>
                <th>Field</th>
                <th>Details</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Address</td>
                <td>{property.address}</td>
            </tr>
            <tr>
                <td>Tax Information</td>
                <td>
                    {property.taxinfo && property.taxinfo.length > 0 ? (
                        property.taxinfo.map((tax, index) => (
                            <div key={index}>
                                <p>Final Levies: {tax.finalLevies}</p>
                                <p>Less Interim Billing: {tax.lessInterimBilling}</p>
                                <p>Total Amount Due: {tax.totalAmountDue}</p>
                                <p>Due Date: {tax.dueDate}</p>
                            </div>
                        ))
                    ) : (
                        <p>No tax information available</p>
                    )}
                </td>
            </tr>
            <tr>
                <td>Liens</td>
                <td>
                    {property.liens && property.liens.length > 0 ? (
                        property.liens.map((lien, index) => (
                            <div key={index}>
                                <p>Date: {lien.date}</p>
                                <p>Type: {lien.type}</p>
                                <p>Amount: {lien.amount}</p>
                                <p>Party To: {lien.partyTo}</p>
                                <p>Party From: {lien.partyFrom}</p>
                                <p style={{ border: "2px solid black" }}></p>
                            </div>
                        ))
                    ) : (
                        <p>No liens available</p>
                    )}
                </td>
            </tr>
            <tr>
                <td>Mortgages</td>
                <td>
                    {property.mortgages && property.mortgages.length > 0 ? (
                        property.mortgages.map((mortgage, index) => (
                            <div key={index}>
                                <p>Amount: {mortgage.amount}</p>
                                <p>Lender: {mortgage.lender}</p>
                                <p>Interest Rate: {mortgage.interestRate}%</p>
                                <p>Start Date: {mortgage.startDate}</p>
                                <p>End Date: {mortgage.endDate}</p>
                            </div>
                        ))
                    ) : (
                        <p>No mortgages available</p>
                    )}
                </td>
            </tr>
        </tbody>
    </table>
);

const LienChart = ({ liens }) => {
    if (!liens || liens.length === 0) {
        return <div>No lien data available for charting.</div>;
    }

    // Prepare data for the chart
    const labels = liens.map((lien) => new Date(lien.date).getFullYear()); // Extract years
    const amounts = liens.map((lien) => lien.amount); // Extract amounts

    const data = {
        labels: labels,
        datasets: [
            {
                label: "Liens Amounts by Year",
                data: amounts,
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
            title: {
                display: true,
                text: "Liens Amounts by Year",
            },
        },
    };

    return (
        <div className="lien_chart">
            <h3>Liens Overview</h3>
            <Bar data={data} options={options} />
        </div>
    );
};


export default Owner