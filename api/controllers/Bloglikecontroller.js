import BlogLike from "../models/bloglikeModel.js"
import { handleError } from "../helpers/handleError.js"
export const doLike = async(req,res,next) => {
     try {
         const {user, blogid} =req.body
         let like
         like = await BlogLike.findOne({user, blogid})
         if(!like){
             const saveLike = new BlogLike({
                 user, blogid
             })

            like = await saveLike.save()
         }
         else{
             await BlogLike.findByIdAndDelete(like._id)
         }
         const likecount = await BlogLike.countDocuments({blogid})
         res.status(200).json({
             likecount
         })
     } catch (error) {
         next (handleError(500, error.message))
     }
}

export const likecount = async (req,res,next)=>{
     try {
         const {blogid, userid} = req.params
         const likecount = await BlogLike.countDocuments({blogid})
         let isUserLiked = false
         if(userid){
             const  getuserlike = await BlogLike.countDocuments({blogid, user: userid})
             if(getuserlike>0){
                 isUserLiked = true
             }
         }

         res.status(200).json({
             likecount,
             isUserliked
         })
     } catch (error) {
        next (handleError(500, error.message)) 
     }
}