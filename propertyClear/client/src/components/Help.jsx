import React from "react";
import { Survey } from "survey-react-ui";
import "survey-core/defaultV2.min.css";
import { Model } from "survey-core";

const Help = () => {
    const surveyJson = {
        title: "Report Technical Issue",
        description: "We're here to help! Please provide the details below.",
        pages: [
            {
                name: "page1",
                title: "Personal Information",
                elements: [
                    {
                        type: "text",
                        name: "question1",
                        title: "Full Name",
                        isRequired: true,
                        placeholder: "Enter your full name"
                    },
                    {
                        type: "text",
                        name: "question2",
                        title: "Email Address",
                        isRequired: true,
                        placeholder: "your.email@example.com",
                        validators: [
                            {
                                type: "email"
                            }
                        ]
                    },
                    {
                        type: "text",
                        name: "question3",
                        title: "Date of Birth",
                        isRequired: true,
                        inputType: "date"
                    },
                    {
                        type: "dropdown",
                        name: "question4",
                        title: "Your Role",
                        isRequired: true,
                        choices: [
                            "Property Owner",
                            "Property Manager",
                            "Tenant",
                            "Agent",
                            "Other"
                        ]
                    }
                ]
            },
            {
                name: "page2",
                title: "Issue Details",
                elements: [
                    {
                        type: "comment",
                        name: "question5",
                        title: "Describe Your Technical Problem",
                        isRequired: true,
                        placeholder: "Please provide as much detail as possible about the issue you're experiencing...",
                        rows: 5
                    }
                ]
            }
        ],
        showQuestionNumbers: "off",
        completeText: "Submit Report",
        showPreviewBeforeComplete: "showAnsweredQuestions"
    };

    const survey = new Model(surveyJson);

    survey.onComplete.add((sender) => {
        const surveyData = sender.data;

        fetch(`${process.env.REACT_APP_APP_URL}/api/surveys`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                full_name: surveyData.question1,
                email: surveyData.question2,
                date_of_birth: surveyData.question3,
                role: surveyData.question4,
                technical_problem: surveyData.question5,
            }),
        }).then((response) => {
            if (response.ok) {
                alert("Thank you! Your report has been submitted successfully.");
            } else {
                alert("We encountered an error submitting your report. Please try again.");
            }
        });
    });

    return (
        <div className="help-page">
            <div className="help-container">
                <div className="help-header">
                    <h1>Technical Support</h1>
                    <p>Report a technical problem with the website</p>
                </div>
                <div className="help-content">
                    <Survey model={survey} />
                </div>
            </div>
        </div>
    );
};

export default Help;