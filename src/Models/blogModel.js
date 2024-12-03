import mongoose from "mongoose";
const blogSchema=new mongoose.Schema(
    {
        title:{
            type:String,
            required:true,
            trime:true,
        },
        content:{
            type:String,
            required:true,

        },
        createdBy:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User", 
            required:true,

        }
    },{
        timestamps:true,
    }
);
const Blog=mongoose.model("Blog",blogSchema);
export default Blog;
