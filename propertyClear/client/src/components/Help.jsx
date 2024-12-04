import React from "react";
import { Survey } from "survey-react-ui";
import "survey-core/defaultV2.min.css";
import { Model } from "survey-core";

const Help = () => {
    // JSON structure for the survey
    const surveyJson = {
        title: "Problem issue",
        description: "Fill out all data",
        pages: [
            {
                name: "page1",
                title: "Tell us about yourself",
                elements: [
                    {
                        type: "text",
                        name: "question1",
                        title: "First and last name (also known as given name))",
                        isRequired: true,
                    },
                    {
                        type: "text",
                        name: "question2",
                        title: "Email address",
                        isRequired: true,
                    },
                    {
                        type: "text",
                        name: "question3",
                        title: "Data of birth",
                        isRequired: true,
                        inputType: "date",
                    },
                    {
                        type: "text",
                        name: "question4",
                        title: "Tell us your role",
                        isRequired: true,
                    },
                ],
            },
            {
                name: "page2",
                title: "Description",
                elements: [
                    {
                        type: "comment",
                        name: "question5",
                        title: "Tell us about your technical problem",
                        isRequired: true,
                    },
                ],
            },
        ],
        showQuestionNumbers: "off",
    };

    // Create Survey Model
    const survey = new Model(surveyJson);



    return (
        <div className="form_component">
            <h2 style={{ textAlign: "center" }}>Report a technical problem: Website (broken links, pages not loading and other issues)</h2>
            <Survey model={survey} />
        </div>
    );
};

export default Help;
