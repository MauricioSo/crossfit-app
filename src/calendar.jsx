import React from "react";

const Tablerow = props => {
  return (
    <tr>
      <td>{props.lunes}</td>
      <td>{props.martes}</td>
      <td>{props.miercoles}</td>
      <td>{props.jueves}</td>
      <td>{props.viernes}</td>
      <td>{props.sabado}</td>
      <td>{props.domingo}</td>
    </tr>
  );
};

const Calendar = props => {
  return (
    <table>
      {props.map(row => {
        return <Tablerow props={row} />;
      })}
    </table>
  );
};

export default Calendar;
