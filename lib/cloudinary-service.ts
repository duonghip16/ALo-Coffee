import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
if (process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })
}

export interface CloudinaryUploadResult {
  public_id: string
  secure_url: string
  width: number
  height: number
  format: string
  bytes: number
}

/**
 * Upload a file to Cloudinary
 * @param file - The file to upload
 * @param folder - Optional folder name in Cloudinary
 * @returns Promise<CloudinaryUploadResult>
 */
export async function uploadToCloudinary(
  file: File,
  folder = 'alo-coffee/products'
): Promise<CloudinaryUploadResult> {
  if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error('Cloudinary chưa được cấu hình. Vui lòng thêm CLOUDINARY_API_KEY và CLOUDINARY_API_SECRET vào .env.local')
  }
  
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
        transformation: [
          { width: 800, height: 600, crop: 'limit' }, // Resize to max 800x600
          { quality: 'auto' }, // Auto quality optimization
          { fetch_format: 'auto' } // Auto format (WebP, AVIF, etc.)
        ]
      },
      (error, result) => {
        if (error) {
          reject(error)
        } else if (result) {
          resolve(result as CloudinaryUploadResult)
        } else {
          reject(new Error('Upload failed: No result returned'))
        }
      }
    )

    // Convert file to buffer and upload
    const reader = new FileReader()
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        uploadStream.end(Buffer.from(reader.result))
      }
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsArrayBuffer(file)
  })
}

/**
 * Delete an image from Cloudinary
 * @param publicId - The public ID of the image to delete
 * @returns Promise
 */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        reject(error)
      } else {
        resolve()
      }
    })
  })
}

/**
 * Extract public ID from Cloudinary URL
 * @param url - Cloudinary URL
 * @returns string - Public ID
 */
export function getPublicIdFromUrl(url: string): string {
  const matches = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z]+$/)
  return matches ? matches[1] : ''
}

/**
 * Generate optimized Cloudinary URL with transformations
 * @param publicId - Public ID of the image
 * @param options - Transformation options
 * @returns string - Optimized URL
 */
export function getOptimizedImageUrl(
  publicId: string,
  options: {
    width?: number
    height?: number
    quality?: string | number
    format?: string
  } = {}
): string {
  const { width = 400, height = 300, quality = 'auto', format = 'auto' } = options

  return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/w_${width},h_${height},c_limit,q_${quality},f_${format}/${publicId}`
}
