import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

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
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const ext = path.extname(file.originalname)
    const filename = `${folder}-${uniqueSuffix}${ext}`
    
    // Target path
    const targetPath = path.join(UPLOAD_DIR, filename)
    
    // If multer uses MemoryStorage, file.buffer exists
    // If DiskStorage, we can just move/rename it, but we'll enforce MemoryStorage for security/validation before saving
    if (file.buffer) {
      fs.writeFileSync(targetPath, file.buffer)
    } else {
      // In case we used diskStorage
      fs.copyFileSync(file.path, targetPath)
    }

    // Return a cloud-like structure
    return {
      url: `/api/trainers/secure-files/${filename}`, // Secure internal URL
      public_id: filename,
      format: ext.replace('.', ''),
      bytes: file.size || (file.buffer ? file.buffer.length : 0)
    }
  } catch (error) {
    console.error('Storage Upload Error:', error)
    throw new Error('Failed to upload file to storage')
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
