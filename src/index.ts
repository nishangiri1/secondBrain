import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { ContentModel, LinkModel, UserModel } from "./db";
import { JWT_PASSWORD } from "./config";
import { userMiddleware } from "./middleware";
import { random} from "./util";
import cors from "cors";

declare global{
  namespace Express{
    export interface Request{
      userId?:string;
    }
  }
}

const app = express();
app.use(express.json());
app.use(cors());

app.post("/api/v1/signup", async (req, res) => {
  //todo: zod validation and hash the password
  const username = req.body.username;
  const password = req.body.password;

  try {
    await UserModel.create({
      username: username,
      password: password,
    });

    res.json({
      message: "User signed up..",
    });
  } catch (e) {
    res.status(411).json({
      message: "user already exist",
    });
  }
});

app.post("/api/v1/signin", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const existingUser = await UserModel.findOne({
    username,
    password,
  });

  if(existingUser){
    const token=jwt.sign({id:existingUser._id},JWT_PASSWORD);

    res.json({
        token
    })
  }else{
    res.status(403).json({
        message:"Incorrect Credentials"
    })
  }


});

app.post("/api/v1/content",userMiddleware, async (req, res) => {
    const link=req.body.link;
    const title=req.body.title;
    const type=req.body.type;

   await ContentModel.create({
        link,
        title,
        type,
        userId:req.userId,
        tags:[]
    })
    res.json({
        message:"Content added"
    })

});

app.get("/api/v1/content",userMiddleware,async (req, res) => {
    //@ts-ignore
    const userId=req.userId;
    const content=await ContentModel.find({
        userId:userId
    }).populate("userId","username")
    res.json({
        content
    })
});

app.delete("/api/v1/content", async (req, res) => {
    const contentId=req.body.contentId;
    
    await ContentModel.deleteMany({
        contentId,
        userId:req.userId
    })

    res.json({
        message:"Content deleated"
    })
});

app.post("/api/v1/brain/share",userMiddleware,async (req, res) => {
  const share =req.body.share;
  if(share){
    const existingLink=await LinkModel.findOne({
      userId:req.userId
    })
    
    if(existingLink){
      res.json({
        message:existingLink.hash
      })
      return;
    }
    const hash=random(10);
    await LinkModel.create({
      userId:req.userId,
      hash:hash
    })
    
    res.json({
      message:hash
    })
  }else{
   await LinkModel.deleteOne({
      userId:req.userId
    })
    res.json({
      message:"removed link"
    })
  }
 
});

app.get("/api/v1/brain/:shareLink", async (req, res) => {
  const hash=req.params.shareLink;
  const link = await LinkModel.findOne({
    hash
  })

  console.log(hash)
  console.log(link)

  if(!link){
    res.status(411).json({
      message:"Sorry incorrect input"
    })
    return;
  }

  const content=await ContentModel.find({
    userId:link.userId
  })

  const user=await UserModel.findOne({
    _id:link.userId
  })

  if(!user){
    res.status(411).json({
      message:"User not found, error should idelly not happen"
    })
    return;
  }

  res.json({
    username:user.username,
    content:content 
  })
});

app.listen(3000);
