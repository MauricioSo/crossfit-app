/* eslint-disable */

import React, { useState, useEffect } from "react";
import Exercise from "./exercise";
import date from "./days";
import "./App.css";
import "font-awesome/css/font-awesome.min.css";
import ExerciseRoutine from "./exercise-for-routine";
import { motion } from "framer-motion";

//function for select only values different that before.Have to retunr an object

const Row = ({ row }) => {
  return (
    <tr className="table-row">
      <td key={row.day} className="table-cell">
        {row.day}
      </td>
      <td key={row.difficult}>{row.difficult}</td>
      <td
        style={{
          backgroundColor:
            row.training === true
              ? "green"
              : row.training === null
              ? "white"
              : "red",
          width: "10px"
        }}
        key={row.training}
      >
        {row.training}
      </td>
    </tr>
  );
};

function App() {
  const [exercises, setExercise] = useState([]);
  const [day, setDay] = useState(0);
  const [dayTrained, setDayTrained] = useState(false);

  //first set the exercises state, fetching the json db
  useEffect(() => {
    setExercise(date[day].exercises);
    setDayTrained(date[day].training);
  }, [day]);
  //set day as trained or not
  const handleSetDayTrained = () => {
    setDayTrained(dayTrained === true ? false : true);
  };
  //we have to set the day and in order of that we retrieve the data. we have to conditin this for retrieve the content of exercises
  const selectFromExercises = e => {
    const selected = e.target.dataset.selected;

    setExercise(
      exercises.map(exercise =>
        exercise.name === selected
          ? {
              ...exercise,
              selected: exercise.selected === false ? true : false
            }
          : exercise
      )
    );
  };

  //method for remove exercise from the routine
  const removeExercise = e => {
    const selected = e.target.dataset.selected;

    setExercise(
      exercises.map(exercise =>
        exercise.name === selected
          ? {
              ...exercise,
              selected: false
            }
          : exercise
      )
    );
  };
  const saveData = () => {
    return (date[day].exercises = exercises);
  };
  const variantsCal = {
    visible: {
      width: 100
    },
    hidden: {
      width: 0
    }
  };
  const variantsRou = {
    visible: {
      width: "45vw"
    },
    hidden: {
      width: 0
    }
  };

  const innerVariants = {
    visible: {
      opacity: 1
    },
    hidden: {
      opacity: 0
    }
  };
  return (
    <div className="container">
      <div className="header">
        <h1 className="title">crossfit-app</h1>
      </div>
      {/*exercise start here*/}
      <div className="exercises" id="exercises">
        {exercises.map((exercise, i) => (
          <Exercise
            key={i.toString()}
            name={exercise.name}
            description={exercise.repetition}
            onClick={selectFromExercises}
            className="exercise-single"
            selected={exercise.name}
            classImg="img-exercise"
            classTitle="title-exer"
            classCategory="cat-exercise"
            classContainerImg="container-img"
            classContainerText="container-text"
          />
        ))}
      </div>
      {/*routine start here*/}

      <div className="wrapper-routine">
        <div className="check-day">
          <label className="label-checkbox">
            <input
              type="checkbox"
              checked={dayTrained === true ? false : true}
              onClick={handleSetDayTrained}
            ></input>
          </label>
        </div>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={variantsRou}
          transition={{ ease: "easeOut", duration: 1 }}
          className="routine"
        >
          <motion.div
            initial="hidden"
            animate="visible"
            variants={innerVariants}
            transition={{ delay: 1 }}
          >
            {exercises
              .filter(value => {
                return value.selected === true;
              })
              .map((exercise, i) => (
                <ExerciseRoutine
                  key={i.toString()}
                  name={exercise.name}
                  repetition={exercise.repetition}
                  series={exercise.series}
                  selected={exercise.name}
                  onClick={removeExercise}
                  className="routine-single"
                  classContainerImg="container-img-rou"
                  classImg="img-exercise"
                  classTitle="title-rou"
                  classDescrip="description-rou"
                  classReps="reps-rou"
                  classCategory="cat-exercise-rou"
                  classSeries="series-rou"
                  classContainerText="container-text-rou"
                  alt="exercise description"
                />
              ))}
          </motion.div>
        </motion.div>
        <button className="btn-save" onClick={saveData}>
          Save
        </button>
      </div>
      {/*calendar start here*/}
      <div className="calendar">
        <div className="table-display">
          <i
            className="fa fa-angle-left icon"
            onClick={() => setDay(day < 1 ? 29 : day - 1)}
          ></i>
          <p className="day-display">day:{day + 1}</p>
          <i
            className="fa fa-angle-right icon"
            onClick={() => setDay(day > 28 ? 0 : day + 1)}
          ></i>
        </div>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={variantsCal}
          transition={{ ease: "easeOut", duration: 1 }}
          className="table-wrapper"
        >
          <table className="table">
            {date.map(row => (
              <Row row={row} />
            ))}
          </table>
        </motion.div>
      </div>
    </div>
  );
}

export default App;
