import mongoose,{Schema} from "mongoose";

const ExecutionSchema=new Schema({

project:{
type:Schema.Types.ObjectId,
ref:"Project"
},

task:String,

inputs:Object,

outputs:Object,

status:String

},{
timestamps:true
});

export default mongoose.models.Execution ||
mongoose.model("Execution",ExecutionSchema);