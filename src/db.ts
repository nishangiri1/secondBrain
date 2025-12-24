
import mongoose, {model,Schema} from "mongoose"
import dotenv from "dotenv";

dotenv.config();
const url=process.env.DB_URI;

if (!url) {
    console.error("❌ DB_URI is missing in .env");
    process.exit(1);
  }
  
mongoose.connect(url)



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

const LinkSchema=new Schema({
    hash: String,
    userId:{type:mongoose.Types.ObjectId,ref:"User",required:true,unique:true}
})

export const LinkModel=model("Links",LinkSchema)

export const UserModel= model("User",UserSchema);

export const ContentModel=model("Content",ContentSchema)