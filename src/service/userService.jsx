import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  arrayUnion,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';

// Plan type constants
export const PLAN_TYPES = {
  STARTER: 1,
  PRO: 2,
  STUDIO: 3
};

// Create or get user document
export const getUserDocument = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data();
    } else {
      // Create new user document
      const userData = {
        userId,
        credits: 0,
        totalPurchased: 0,
        purchaseHistory: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      await setDoc(userRef, userData);
      return userData;
    }
  } catch (error) {
    console.error('Error getting user document:', error);
    throw error;
  }
};

// Add purchase and update credits
export const addPurchase = async (userId, purchaseData) => {
  try {
    const userRef = doc(db, 'users', userId);
    
    const purchase = {
      purchaseId: `purchase_${Date.now()}`,
      planType: purchaseData.planType,
      planName: purchaseData.planName,
      amount: purchaseData.amount,
      credits: purchaseData.credits,
      purchaseDate: serverTimestamp(),
      status: 'completed',
      transactionId: purchaseData.transactionId
    };

    // Update user document
    await updateDoc(userRef, {
      credits: purchaseData.credits, // Replace or add logic to accumulate
      totalPurchased: arrayUnion(purchase.amount),
      purchaseHistory: arrayUnion(purchase),
      currentPlan: {
        planType: purchaseData.planType,
        planName: purchaseData.planName,
        credits: purchaseData.credits,
        purchasedOn: serverTimestamp(),
        expiresOn: purchaseData.planType === PLAN_TYPES.STUDIO ? 
          new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() : null
      },
      updatedAt: serverTimestamp()
    });

    return purchase;
  } catch (error) {
    console.error('Error adding purchase:', error);
    throw error;
  }
};

// Update user credits (when user uses credits)
export const updateUserCredits = async (userId, creditsUsed) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const newCredits = Math.max(0, userData.credits - creditsUsed);
      
      await updateDoc(userRef, {
        credits: newCredits,
        updatedAt: serverTimestamp()
      });
      
      return newCredits;
    }
  } catch (error) {
    console.error('Error updating credits:', error);
    throw error;
  }
};

// Get user current credits
export const getUserCredits = async (userId) => {
  try {
    const userDoc = await getUserDocument(userId);
    return userDoc.credits || 0;
  } catch (error) {
    console.error('Error getting user credits:', error);
    return 0;
  }
};