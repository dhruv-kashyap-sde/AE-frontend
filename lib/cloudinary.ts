/**
 * Cloudinary Configuration
 * 
 * Setup and helper functions for Cloudinary image uploads.
 */

import { v2 as cloudinary } from "cloudinary"

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export interface CloudinaryUploadResult {
  public_id: string
  secure_url: string
  url: string
  width: number
  height: number
  format: string
  bytes: number
}

/**
 * Upload an image buffer to Cloudinary
 */
export async function uploadImage(
  buffer: Buffer,
  folder: string = "questions"
): Promise<CloudinaryUploadResult> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: `accurate-exam/${folder}`,
          resource_type: "image",
          transformation: [
            { quality: "auto:good" },
            { fetch_format: "auto" },
          ],
        },
        (error, result) => {
          if (error) {
            reject(error)
          } else if (result) {
            resolve({
              public_id: result.public_id,
              secure_url: result.secure_url,
              url: result.url,
              width: result.width,
              height: result.height,
              format: result.format,
              bytes: result.bytes,
            })
          } else {
            reject(new Error("Upload failed - no result"))
          }
        }
      )
      .end(buffer)
  })
}

/**
 * Upload a base64 image to Cloudinary
 */
export async function uploadBase64Image(
  base64String: string,
  folder: string = "questions"
): Promise<CloudinaryUploadResult> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      base64String,
      {
        folder: `accurate-exam/${folder}`,
        resource_type: "image",
        transformation: [
          { quality: "auto:good" },
          { fetch_format: "auto" },
        ],
      },
      (error, result) => {
        if (error) {
          reject(error)
        } else if (result) {
          resolve({
            public_id: result.public_id,
            secure_url: result.secure_url,
            url: result.url,
            width: result.width,
            height: result.height,
            format: result.format,
            bytes: result.bytes,
          })
        } else {
          reject(new Error("Upload failed - no result"))
        }
      }
    )
  })
}

/**
 * Delete an image from Cloudinary by public_id
 */
export async function deleteImage(publicId: string): Promise<boolean> {
  try {
    const result = await cloudinary.uploader.destroy(publicId)
    return result.result === "ok"
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error)
    return false
  }
}

/**
 * Extract public_id from Cloudinary URL
 */
export function getPublicIdFromUrl(url: string): string | null {
  try {
    // URL format: https://res.cloudinary.com/{cloud}/image/upload/{version}/{folder}/{public_id}.{format}
    const regex = /\/upload\/(?:v\d+\/)?(.+)\.\w+$/
    const match = url.match(regex)
    return match ? match[1] : null
  } catch {
    return null
  }
}

export default cloudinary
