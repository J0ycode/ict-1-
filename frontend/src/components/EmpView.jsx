import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";


const EmpView = () => {
  var [emp, setEmp] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:3002/")
      .then((res) => {
        console.log(res);
        setEmp(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const deleEmp = (id) => {
    console.log(id);
    axios
        .delete(`http://localhost:3002/${id}`)
        .then((res)=>{
            alert(res.data);
            window.location.reload()
        })
  };
  return (
    <div>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Employee Name</TableCell>
              <TableCell>Employee Age</TableCell>
              <TableCell>Employee Department</TableCell>
              <TableCell>Employee Salary</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {emp.map((val) => {
              return (
                <TableRow>
                  <TableCell>{val.ename}</TableCell>
                  <TableCell>{val.eage}</TableCell>
                  <TableCell>{val.edept}</TableCell>
                  <TableCell>{val.esalary}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      onClick={() => {
                        deleEmp(val._id);
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};


export default EmpView;



