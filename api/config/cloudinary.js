import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv'

dotenv.config()

    // Configuration
    cloudinary.config({ 
        cloud_name: 'deybux4l0', 
        api_key: '699399536686717' , 
        api_secret: 'OADLjVTGe4t5M2Xody2rk0UjPxM'
    });

    export default cloudinary