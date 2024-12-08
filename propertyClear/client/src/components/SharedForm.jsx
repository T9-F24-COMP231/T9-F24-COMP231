import React, { useState } from "react";

const SharedForm = () => {
  const [userType, setUserType] = useState("agent"); // Default user type
  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    propertyAddress: "",
    propertyType: "",
    propertyPrice: "",
    additionalInfo: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionStatus(null);

    try {
      const response = await fetch(`${process.env.REACT_APP_APP_URL}/api/submit-property`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (result.success) {
        setSubmissionStatus("Form submitted successfully!");
        setFormData({
          clientName: "",
          clientEmail: "",
          clientPhone: "",
          propertyAddress: "",
          propertyType: "",
          propertyPrice: "",
          additionalInfo: "",
        });
      } else {
        setSubmissionStatus("Error submitting the form.");
      }
    } catch (error) {
      console.error("Error:", error);
      setSubmissionStatus("Error submitting the form.");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="shared-form">
      <h2>Property Information Form</h2>

      <div className="form-select">
        <label>Select User Type:</label>
        <select value={userType} onChange={(e) => setUserType(e.target.value)}>
          <option value="agent">Agent</option>
          <option value="broker">Broker</option>
          <option value="investor">Investor</option>
        </select>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Client Information Section */}
        <div className="form-section">
          <h3>Client Information</h3>
          <label>Client Name:</label>
          <input
            type="text"
            name="clientName"
            value={formData.clientName}
            onChange={handleChange}
            required
          />

          <label>Client Email:</label>
          <input
            type="email"
            name="clientEmail"
            value={formData.clientEmail}
            onChange={handleChange}
            required
          />

          <label>Client Phone:</label>
          <input
            type="text"
            name="clientPhone"
            value={formData.clientPhone}
            onChange={handleChange}
            required
          />
        </div>

        {/* Property Information Section */}
        <div className="form-section">
          <h3>Property Information</h3>
          <label>Property Address:</label>
          <input
            type="text"
            name="propertyAddress"
            value={formData.propertyAddress}
            onChange={handleChange}
            required
          />

          <label>Property Type:</label>
          <input
            type="text"
            name="propertyType"
            value={formData.propertyType}
            onChange={handleChange}
            required
          />

          <label>Property Price:</label>
          <input
            type="number"
            name="propertyPrice"
            value={formData.propertyPrice}
            onChange={handleChange}
            required
          />

          {/* Additional Info for Agent/Broker/Investor */}
          {userType === "agent" && (
            <>
              <label>Agent Notes:</label>
              <textarea
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleChange}
                placeholder="Additional notes for the property"
              />
            </>
          )}

          {userType === "broker" && (
            <>
              <label>Broker Commission:</label>
              <input
                type="number"
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleChange}
                placeholder="Enter the broker's commission"
              />
            </>
          )}

          {userType === "investor" && (
            <>
              <label>Investment Potential:</label>
              <textarea
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleChange}
                placeholder="Notes on the investment potential"
              />
            </>
          )}
        </div>

        {/* Submit Button */}
        <div className="form-action">
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>

        {/* Submission Status */}
        {submissionStatus && <div className="form-status">{submissionStatus}</div>}
      </form>
    </div>
  );
};

export default SharedForm;
