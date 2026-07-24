import mongoose,{Schema} from "mongoose";

const ProjectSchema=new Schema({

owner:{
type:Schema.Types.ObjectId,
ref:"User"
},

name:String,

slug:String,

description:String,

githubRepo:String,

githubBranch:String,

runtimeUrl:String,

metadata:Object,

status:{
type:String,
default:"draft"
}

},{
timestamps:true
});

export default mongoose.models.Project ||
mongoose.model("Project",ProjectSchema);