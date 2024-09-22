import multer from "multer"
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Resolve the directory path for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the path to the uploads directory
const uploadDir = path.resolve(__dirname, '../uploads');

// Debugging: Print the resolved path
console.log('Resolved Upload Directory Path:', uploadDir);

// Ensure the uploads directory exists
if (!fs.existsSync(uploadDir)) {
  console.log('Uploads directory does not exist. Creating...');
  fs.mkdirSync(uploadDir, { recursive: true });
} else {
  console.log('Uploads directory exists.');
}

const storage=multer.diskStorage({
    
    destination: function (req,file,cb){

        cb(null,uploadDir)
    },
    filename:function (req,file, cb){
        cb(null,Date.now()+file.originalname)

    }


})
export const upload =multer({storage})