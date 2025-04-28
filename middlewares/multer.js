// Multer is a Node.js middleware used primarily for handling multipart/form-data,
//  which is the format used for file uploads in web applications.
//  It simplifies the process of receiving, processing, and storing files
//  uploaded by users


import multer from "multer"

const storage = multer.diskStorage({
    filename: function(req, file, callback){
        callback(null, file.originalname)
    }
})

export const upload = multer({
    storage
})