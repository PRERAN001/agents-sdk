import mongoose,{Schema} from "mongoose";

const SecretSchema=new Schema({

project:{
type:Schema.Types.ObjectId,
ref:"Project"
},

key:String,

encryptedValue:String

},{
timestamps:true
});

export default mongoose.models.Secret ||
mongoose.model("Secret",SecretSchema);