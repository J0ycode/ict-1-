// import express
import express from 'express';
import "./db.js";
import employee from "./model/employee.js";
import cors from 'cors'
// initialize express
var app = express();

//middleware
app.use(express.json());
app.use(cors())
//api
//api to add data to db
app.post(`/`,async(req,res)=>{
    try{
        await employee(req.body).save();
        res.send("Employee data added");
    }catch (error){
        console.log(error);
    }
})

app.get("/a", async (req, res) => {
  try {
    var data = await employee.find();
    res.send(data);
  } catch (error) {
    console.log(error);
  }
});

app.delete('/:id',async(req,res) =>{
    try{
        await employee.findByIdAndDelete(req.params.id);
        res.send("Employee data deleted");
    } catch (error){
        console.log(error);
    }
})

app.put('/:a',async(req,res) =>{
    try{
        await employee.findByIdAndUpdate(req.params.a, req.body);
        res.send("Employee Data updated");
    } catch (error){
        console.log(error);
    }
})


// server is listening
const port = 3002
app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})