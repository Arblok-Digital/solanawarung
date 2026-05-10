import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { storage } from '../../config/firebase';

/**
 * Uploads a base64 image string to Firebase Storage
 * @param base64 String containing the image data
 * @param path Path in the storage (e.g. 'products/product_id.jpg')
 * @returns Download URL of the uploaded image
 */
export const uploadImage = async (base64: string, path: string): Promise<string> => {
  try {
    const storageRef = ref(storage, path);
    // Remove metadata if present
    const base64Content = base64.includes(',') ? base64.split(',')[1] : base64;
    
    await uploadString(storageRef, base64Content, 'base64', {
      contentType: 'image/jpeg'
    });
    
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error('Firebase Storage upload error:', error);
    throw new Error('Failed to upload image to storage');
  }
};
