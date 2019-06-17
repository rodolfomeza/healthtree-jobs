import React from "react";

const TreatmentMessageOptions = (props) => {
  return (
    <div>
      <div className="myeloma_content">
        <label>
          {" "}
          Hello {props.fname}. Welcome to your treatment options
          page. The list of treatment options below is personalized
          for you based on the questions you have already taken the
          time to answer. Over time as you update your diagnosis,
          health and treatment information we will continue to
          customize the list below and provide you with the options
          that are just right for you.{" "}
        </label>
      </div>
      <div className="myeloma_content">
        <label>
          {" "}
          Remember these treatment options are not replacements for
          medical opinions by a licensed oncologists, hematologists or
          myeloma specialists. HealthTree provides general guidance
          that should be taken to a medical professional who can
          review the specifics of your case.
        </label>
      </div>
    </div>
  );
};

export default TreatmentMessageOptions;