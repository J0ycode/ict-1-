import mongoose from "mongoose";

var employeeSchema = mongoose.Schema({
    ename:String,
    eage:Number,
    edept:String,
    esalary:Number
});

//model creation
var employeeModel = mongoose.model("employee", employeeSchema);

export default employeeModel;
