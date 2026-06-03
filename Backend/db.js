import mongoose from "mongoose";

mongoose
    .connect("mongodb://joyel:jo12@ac-frkgsoj-shard-00-00.dap7stj.mongodb.net:27017,ac-frkgsoj-shard-00-01.dap7stj.mongodb.net:27017,ac-frkgsoj-shard-00-02.dap7stj.mongodb.net:27017/EmployeeApp?ssl=true&replicaSet=atlas-rztdz3-shard-0&authSource=admin&appName=Cluster0")
    .then(() => {
        console.log("connected to db")
    })
    .catch((err)=>{
        console.log(err)
    })