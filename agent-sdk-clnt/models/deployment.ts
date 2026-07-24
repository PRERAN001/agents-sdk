import mongoose,{Schema} from "mongoose";

const DeploymentSchema=new Schema({

project:{
type:Schema.Types.ObjectId,
ref:"Project"
},

status:String,

commitHash:String,

logs:[String],

runtime:String

},{
timestamps:true
});

export default mongoose.models.Deployment ||
mongoose.model("Deployment",DeploymentSchema);