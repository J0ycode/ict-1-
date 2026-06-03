import { Button, TextField, Typography } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddEmp = () => {
    var navigate = useNavigate();
    var [input,setInput] = useState({
        ename:"",
        eage:"",
        edept:"",
        esalary:"",

    });
    const inputHandler = (e) => {
        const { name, value } = e.target;
        setInput((prev) => ({ ...prev, [name]: value }));
    };
    
    const submitHandler =()=>{
      axios
        .post("http://localhost:3002",input)
        .then((res) => {
          alert(res.data);
          navigate("/");
        })
        .catch((err) => {
          console.log(err);

        })
    }
  return (
    <div>
      <Typography variant="h4">Welcome to Employe App</Typography><br />
      <TextField
       variant="outlined" 
      label="Employee Name"
      name="ename"
      value={input.ename}
      onChange={inputHandler}
      />
      <br />
      <br />
      <TextField
       variant="outlined" 
       label="Employee Age" 
       name="eage"
      value={input.eage}
      onChange={inputHandler}/>
      <br />
      <br />
      <TextField
       variant="outlined"
        label="Employee Department" 
      name="edept"
      value={input.edept}
      onChange={inputHandler}/>
      <br />
      <br />
      <TextField 
      variant="outlined"
       label="Employee Salary"
      name="esalary"
      value={input.esalary}
      onChange={inputHandler} />
      <br />
      <br />
      <Button variant="contained" onClick={submitHandler}>Submit</Button>
    </div>
  );
};

export default AddEmp;