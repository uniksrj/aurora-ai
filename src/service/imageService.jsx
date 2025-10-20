import { collection, doc, getDoc, getDocs, orderBy, query, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";


// Save generated image to user's history
export const saveGeneratedImage = async (userId, imageData) => {
  try {
    const imageRef = doc(collection(db, 'users', userId, 'generatedImages'));
    
    const imageDoc = {
      id: imageRef.id,
      imageUrl: imageData.imageUrl,
      prompt: imageData.prompt,
      stylePreset: imageData.stylePreset,
      aspectRatio: imageData.aspectRatio,
      negativePrompt: imageData.negativePrompt,
      strength: imageData.strength,
      createdAt: serverTimestamp(),
      creditsUsed: 1, // 1 credit per image
    };

    await setDoc(imageRef, imageDoc);
    return imageDoc;
    
  } catch (error) {
    console.error('Error saving image:', error);
    throw error;
  }
};

// Get user's generated images
export const getUserGeneratedImages = async (userId, limit = 20) => {
  try {
    const imagesRef = collection(db, 'users', userId, 'generatedImages');
    const q = query(
      imagesRef, 
      orderBy('createdAt', 'desc'), 
      // limit(limit) // Uncomment if you want to limit results
    );
    
    const querySnapshot = await getDocs(q);
    const images = [];
    
    querySnapshot.forEach((doc) => {
      images.push({ id: doc.id, ...doc.data() });
    });
    
    return images;
  } catch (error) {
    console.error('Error fetching images:', error);
    throw error;
  }
};

// Get image by ID
export const getImageById = async (userId, imageId) => {
  try {
    const imageRef = doc(db, 'users', userId, 'generatedImages', imageId);
    const imageDoc = await getDoc(imageRef);
    
    if (imageDoc.exists()) {
      return { id: imageDoc.id, ...imageDoc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching image:', error);
    throw error;
  }
};