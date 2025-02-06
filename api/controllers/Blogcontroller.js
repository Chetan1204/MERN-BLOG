import cloudinary from "../config/cloudinary.js";
import { handleError } from "../helpers/handleError.js";
import Blog from "../models/blogModel.js"
import {encode} from 'entities'
import Category from "../models/categoryModel.js";
export const addBlog = async (req, res, next) =>{
try {
    console.log(req?.body)
    const data = JSON.parse(req.body.data)
    console.log("cccc",data);
    
    let featuredImage = ''
     if(req.file){
           // upload an image
            const uploadResult = await cloudinary.uploader
            .upload(
               req.file.path,
               {folder: 'mern-blog', resource_type: 'auto'}
            )
            .catch((error) => {
               next(handleError(500, error.message))
            });
    
           featuredImage = uploadResult.secure_url
    
        }
    const blog = new Blog({
        author: data.author,
        category: data.category,
        title: data.title,
        slug: data.slug,
        featuredImage: featuredImage,
        blogContent: encode (data.blogContent),
    })

    await blog.save()

    res.status(200).json({
        success: true,
        message: "Blog added successfully",
    })

} catch (error) {
    next(handleError(500, error.message))
}
}

export const editBlog = async(req,res,next)=>{
    try {
        const {blogid} = req.params
        console.log("><<<",blogid)
        const blog = await Blog.findById(blogid).populate('category','name')
        if(!blog){
            next(handleError(404,'Data not found'))
        }
        res.status(200).json({
            blog
        })
        
    } catch (error) {
        next(handleError(500,error.message))
    }
}


export const updateBlog = async(req,res,next)=>{
    try {
        const {blogid} = req.params
        const data = JSON.parse(req.body.data)
        
        const category = data.category
        const title = data.title
        const slug = data.slug
        const blogContent = encode(data.blogContent)

        let featuredImage;
        
        const existingBlog = await Blog.findById(blogid);

        console.log("Existing one", existingBlog);
        

        if(req.file){
            // upload an image

            const uploadResult = await cloudinary.uploader.upload(
                req.file.path,
                {folder: 'mern-blog', resource_type: 'auto'}
            )
            .catch((error)=>{
                next(handleError(500, error.message))
            });
            featuredImage = uploadResult.secure_url
        }


        const updateBlog = await Blog.findByIdAndUpdate(
            blogid,
            {
                $set: {
                    category: category,
                    title: title,
                    slug: slug,
                    blogContent: blogContent,
                    featuredImage: featuredImage
                },
            },
            { new: true } 
        );

        if (!updateBlog) {
            return res.status(404).json({ success: false, message: "Blog not found" });
        }

        res.status(200).json({
            success:true,
            message: 'Blog Updated successfully'
        })
    } catch (error) {
        next(handleError(500,error.message))
    }
}

export const deleteBlog = async(req,res,next)=>{
    try {
        const {blogid} = req.params
        await Blog.findByIdAndDelete(blogid)
        res.status(200).json({
            success: true,
            message: 'Blog deleted successfully.'
            })
    
    } catch (error) {
     next(handleError(500, error.message))
    }
}

export const showAllBlog = async(req,res,next)=>{
    try {
        
        const blog  = await Blog.find().populate('author', 'name avatar role').populate('category','name slug').
        sort({createdAt: -1}).lean().exec()
        res.status(200).json({
            blog
        })
      
    } catch (error) {
        next(handleError(500,error.message))
    }
}

export const getBlog = async (req,res,next)=>{
    try {

        const {slug} = req.params
        const blog = await Blog.findOne({slug:slug}).populate('author', 'name avatar role')
        .populate('category', 'name slug').lean().exec()
        res.status(200).json({
            blog
        })
    } catch (error) {
        next(handleError(500, error.message))
    }
}

export const getRelatedBlog = async (req,res,next)=>{
    try {

        const {category, blog} = req.params
      
        
        const categoryData = await Category.findOne({slug: category})

        if(!categoryData){
            return next(404, 'Category data not found ')
        }
        const categoryId = categoryData._id
        const relatedBlog = await Blog.find({category: categoryId, slug:{$ne: blog}}).lean().exec()
        res.status(200).json({
           relatedBlog
        })
    } catch (error) {
        next(handleError(500, error.message))
    }
}
export const getBlogByCategory = async (req,res,next)=>{
    try {

        const {category} = req.params
      
        
        const categoryData = await Category.findOne({slug: category})

        if(!categoryData){
            return next(404, 'Category data not found ')
        }
        const categoryId = categoryData._id
        const relatedBlog = await Blog.find({category: categoryId }).populate('author','name avatar role').populate('category', 'name slug').lean().exec()
        res.status(200).json({
            relatedBlog,
            categoryData
        })
    } catch (error) {
        next(handleError(500, error.message))
    }
}

export const search = async (req,res,next)=>{
    try {

        const {q} = req.query
      
        
       
        const relatedBlog = await Blog.find({title:{$regex: q, $options: 
            'i'} }).populate('author','name avatar role').populate
            ('category', 'name slug').lean().exec()
        res.status(200).json({
            relatedBlog,
           
        })
    } catch (error) {
        next(handleError(500, error.message))
    }
}

