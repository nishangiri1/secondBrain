
import mongoose, {model,Schema} from "mongoose"

mongoose.connect("mongodb+srv://nishan:nishan@cluster0.klk8q.mongodb.net/brainly")

const UserSchema=new Schema({
    username:{type: String,unique:true},
    password:{type: String}
})

const ContentSchema=new Schema({
    title:String,
    link:String,
    tags:[{type:mongoose.Types.ObjectId,ref:"Tag"}],
    userId:{type:mongoose.Types.ObjectId,ref:"User",required:true}
})

export const UserModel= model("User",UserSchema);

export const ContentModel=model("Content",ContentSchema)