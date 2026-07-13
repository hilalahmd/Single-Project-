import multer from 'multer'
import path from 'path'

// We use MemoryStorage so we can validate files before writing them 
// and seamlessly pass them to our storage service.
const storage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|pdf/
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  // Check mime
  const mimetype = filetypes.test(file.mimetype)

  if (mimetype && extname) {
    return cb(null, true)
  } else {
    cb(new Error('Error: File upload only supports the following filetypes - ' + filetypes))
  }
}

export const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter 
})
