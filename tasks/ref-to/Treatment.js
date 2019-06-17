import React from "react";
import { Link } from "react-router";

const Treatment = (props) => {
    let index = props.index;
    let value = props.value;
    let str = props.str;
  return (
    <div
        className="subtreatmenthr custom1-subtreatmenthr treatmentclshome"
        key={index}
    >
        <span className="treatment-outer1">
        <span className="treatement-images">
            <img
            src={value.iconUrl}
            className={
                value.className ? value.className : "imglogosize"
            }
            />{" "}
        </span>{" "}
        <span className="treatmentoptionhomecount">
            {" "}
            {value.count}{" "}
        </span>{" "}
        <span className="treatmentoptionhomename">
            {" "}
            {value.name}{" "}
        </span>
        </span>
        <Link
        to={`/treatment-option/treatments/${str}`}
        className="treatment-outer-btn"
        >
        <button className="btn-rt btn blue_btn text-center hvr-bounce-to-top treatmentcls">
            {" "}
            {value.btnlabel
            ? value.btnlabel
            : "View Treatments"}{" "}
        </button>{" "}
        </Link>
    </div>
  );
};

export default Treatment;