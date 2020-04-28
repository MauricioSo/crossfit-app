/* eslint-disable */

import React, { useState, useEffect } from "react";
import Exercise from "./exercise";
import date from "./days";
import "./App.css";
import "font-awesome/css/font-awesome.min.css";
import ExerciseRoutine from "./exercise-for-routine";
import { motion } from "framer-motion";
import firebaseConfig from "./firebase";
import * as firebase from "firebase";
import { ResponsivePie } from "@nivo/pie";
//function for select only values different that before.Have to retunr an object
import firestore from "firebase/firestore";
import exerJSON from "./exercisesJSON";




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
              ? "#e7ede8"
              : row.training === false
                ? "#eba1a1"
                : "white",
          width: "10px",
          borderRadius: "5px"
        }}
        key={row.training}
      ></td>
    </tr>
  );
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();

const db = firebase.firestore();

// exerJSON.map(function (obj) {
//   db.collection("exercises").add({

//     name: obj.name,
//     picture: obj.picture,
//     repetition: obj.repetition,
//     series: obj.series
//   }).then(function (docRef) {

//   })
//     .catch(function (error) {
//       console.error("Error adding document: ", error);
//     });
// });

// const data = date.map((day, index) => {
//   return {
//     day: index,
//     training: day.training === null ? "not-yet" : day.training,
//     exercises: date[index].exercises
//   };
// });

function App() {
  const [exercises, setExercise] = useState([]);
  const [day, setDay] = useState(0);
  const [dayTrained, setDayTrained] = useState(false);
  const [calendar, setCalendar] = useState([]);
  const [colle, setColle] = useState([]);
  //const [dataPie, setDataPie] = useState([]);
  //first set the exercises state, fetching the json db
  useEffect(() => {

    db.collection("exercises")
      .get()
      .then(querySnapshot => {
        const data = querySnapshot.docs.map(doc => doc.data())
        setExercise(data);
      }).catch(err => console.log(err));

    const ref = firebase.database().ref();

  }, []);
  console.log(exercises)
  
  useEffect(() => {
    const ref = firebase.database().ref();
    ref.on(
      "value",
      function (snapshot) {
        const days = [];
        snapshot.val().forEach((data, i) => {
          return days.push(data);
        });
        console.log(days);
        setCalendar(days);
        setDayTrained(snapshot.val()[day].training);
        setExercise(snapshot.val()[day].exercises);
      },
      function (error) {
        console.log("Error: " + error.code);
      }
    );
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
    const dataRef = firebase.database().ref(`${day}`);
    dataRef.update({
      exercises: exercises,
      training: dayTrained
    });
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

  //data for pie graph
  const train = [
    {
      id: "trained",
      label: "trained",
      value: 0,
      color: "hsl(187, 70%, 50%)"
    },
    {
      id: "notTrained",
      label: "notTrained",
      value: 0,
      color: "hsl(203, 70%, 50%)"
    }
  ];
  const dataPie = calendar
    .map(day => {
      return day.training;
    })
    .map(el => {
      if (el === true) {
        return train[0].value++;
      } else if (el === false) {
        return train[1].value++;
      }
    });

  console.log(JSON.stringify(train));
  return (
    <div className="container">
      <div className="header">
        <h1 className="title">crossfit-app</h1>
      </div>

      {/*exercise start here*/}
      <motion.div className="exercises" id="exercises">
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
      </motion.div>
      {/*routine start here*/}

      <div className="wrapper-routine">
        <div className="check-day">
          <label className="label-checkbox">
            <input
              type="checkbox"
              checked={dayTrained === true ? true : false}
              onClick={handleSetDayTrained}
              className="checkTraining"
            ></input>
            day trained
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
      <div className="container-cal">
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
              {calendar.map(row => (
                <Row row={row} />
              ))}
            </table>
          </motion.div>
        </div>
      </div>
      <div class="chart">
        <ResponsivePie
          data={JSON.stringify(dataPie)}
          margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
          width={100}
          height={100}
          innerRadius={0.5}
          padAngle={0.7}
          cornerRadius={3}
          colors={{ scheme: "nivo" }}
          borderWidth={1}
          borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
          radialLabelsSkipAngle={10}
          radialLabelsTextXOffset={6}
          radialLabelsTextColor="#333333"
          radialLabelsLinkOffset={0}
          radialLabelsLinkDiagonalLength={16}
          radialLabelsLinkHorizontalLength={24}
          radialLabelsLinkStrokeWidth={1}
          radialLabelsLinkColor={{ from: "color" }}
          slicesLabelsSkipAngle={10}
          slicesLabelsTextColor="#333333"
          animate={true}
          motionStiffness={90}
          motionDamping={15}
          legends={[
            {
              anchor: "bottom",
              direction: "row",
              translateY: 56,
              itemWidth: 100,
              itemHeight: 18,
              itemTextColor: "#999",
              symbolSize: 18,
              symbolShape: "circle",
              effects: [
                {
                  on: "hover",
                  style: {
                    itemTextColor: "#000"
                  }
                }
              ]
            }
          ]}
        />
      </div>
    </div>
  );
}

export default App;
