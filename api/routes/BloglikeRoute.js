import { doLike, likecount } from "../controllers/BlogLikecontroller.js"
import express from 'express'
const BlogLikeRoute = express.Router()

BlogLikeRoute.post('/do-like', doLike)
BlogLikeRoute.get('/get-like/:blogid/:userid?', likecount)
export default BlogLikeRoute;