import React from "react";

const Exercise = props => {
  return (
    <div onClick={props.onClick} className={props.className}>
      <div className={props.classContainerImg}>
        <img
          src={props.src}
          className={props.classImg}
          alt="description exercise"
        />
      </div>
      <div className={props.classContainerText}>
        <h2 data-selected={props.selected} className={props.classTitle}>
          {props.name}
        </h2>
        <p className={props.classCategory}>{props.category}</p>
      </div>
    </div>
  );
};

export default Exercise;
