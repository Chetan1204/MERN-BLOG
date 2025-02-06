
import {handleError} from "../helpers/handleError.js"
import User from "../models/userModel.js"
import bcryptjs from 'bcryptjs'
import cloudinary from '../config/cloudinary.js'
export const getUser = async (req, res, next)=>{
    try {
        const userId = req.query.userid;
        const user = await User.findById(userId)
        if(!user){
            next(handleError(404,'User not found'))
        }
        res.status(200).send(user)
    } catch (error) {
        next (handleError(500, error.message))
    }
}



export const updateUser = async (req, res, next) => {
    try {
       const data = JSON.parse(req.body.data)
       const {userid} = req.params

    const user = await User.findById(userid)
    


    user.name = data.name
    user.bio = data.bio


    if(data.password && data.password.length >= 8){
      const hashedPassword = bcryptjs.hashSync(data.password)
      user.password = hashedPassword
    }

    if(req.file){
        const uploadResult = await cloudinary.uploader
        .upload(
           req.file.path,
           {folder: 'mern-blog', resource_type: 'auto'}
        )
        .catch((error) => {
           next(handleError(500, error.message))
        });

        user.avatar = uploadResult?.secure_url
        console.log("<<<<",uploadResult)

    }
      await  user.save()
    const newUser  = user.toObject({getters: true})
    delete newUser.password
        res.status(200).json({
            success: true,
            message: "data updated",
            user: newUser
        })
        
    } catch (error) {
        next (handleError(500, error.message))
    }
}

export const getAllUser = async (req, res, next) => {
    try {
        const user = await User.find().sort({ createdAt: -1 })
        res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        next(handleError(500, error.message))
    }
}
export const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params
        const user = await User.findByIdAndDelete(id)
        res.status(200).json({
            success: true,
            message: 'Data deleted.'
        })
    } catch (error) {
        next(handleError(500, error.message))
    }
}