import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'

dotenv.config()

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Abstracted Cloud Storage Layer
// This mimics a cloud provider like Cloudinary or AWS S3.
// Right now it stores files locally in a secure directory, but 
// it returns a structure that makes switching to Cloudinary trivial.

const UPLOAD_DIR = path.join(__dirname, '../../uploads')

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true })
}

/**
 * Uploads a file to the storage provider
 * @param {Object} file - The file object from Multer
 * @param {String} folder - The folder name (e.g. 'certifications')
 * @returns {Promise<Object>} - Contains secure URL and publicId
 */
   export const uploadFile = async (file, folder = 'misc') => {
  try {
    return new Promise((resolve, reject) => {
      // Memory-il ninnulla file cloudinary-lekku stream cheyyunnu
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: folder, resource_type: 'auto' },
        (error, result) => {
          if (error) return reject(error);
          
          resolve({
            url: result.secure_url, // Ithanu namukku vendathu!
            public_id: result.public_id,
            format: result.format,
            bytes: result.bytes
          });
        }
      );
      
      uploadStream.end(file.buffer);
    });
  } catch (error) {
    console.error('Cloudinary Upload Error:', error)
    throw new Error('Failed to upload file to Cloudinary')
  }
}


/**
 * Deletes a file from the storage provider
 * @param {String} publicId - The public ID (filename in this local setup)
 */
export const deleteFile = async (publicId) => {
  try {
    const targetPath = path.join(UPLOAD_DIR, publicId)
    if (fs.existsSync(targetPath)) {
      fs.unlinkSync(targetPath)
    }
    return true
  } catch (error) {
    console.error('Storage Delete Error:', error)
    return false
  }
}

/**
 * Securely streams a file back if authorized
 */
export const getSecureFileStream = (filename) => {
  const targetPath = path.join(UPLOAD_DIR, filename)
  if (!fs.existsSync(targetPath)) {
    throw new Error('File not found')
  }
  return fs.createReadStream(targetPath)
}
