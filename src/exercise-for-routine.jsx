import React from "react";

const ExerciseRoutine = props => {
  return (
    <div onClick={props.onClick} className={props.className}>
      <div className={props.classContainerImg}>
        <img src={props.src} className={props.classImg} alt={props.alt} />
      </div>
      <div className={props.classContainerText}>
        <h2 data-selected={props.selected} className={props.classTitle}>
          {props.name}
        </h2>
        <p className={props.classCategory}>{props.category}</p>
        <p className={props.classDescrip}> {props.description}</p>
        <p className={props.classReps}>repetitions: {props.repetition}</p>
        <p className={props.classSeries}>series: {props.series}</p>
      </div>
    </div>
  );
};

export default ExerciseRoutine;
