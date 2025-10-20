export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { admin } = await import('firebase-admin');
    
    // Verify admin role
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    const userDoc = await admin.firestore().collection('users').doc(decodedToken.uid).get();
    
    if (!userDoc.exists || userDoc.data().role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { publicIds } = req.body; // Array of public_ids to delete

    // Delete from Cloudinary
    const cloudinary = (await import('cloudinary')).v2;
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const deletePromises = publicIds.map(publicId => 
      cloudinary.uploader.destroy(publicId)
    );

    const results = await Promise.all(deletePromises);

    // Delete from Firestore
    const batch = admin.firestore().batch();
    const imagesSnapshot = await admin.firestore()
      .collection('images')
      .where('publicId', 'in', publicIds)
      .get();

    imagesSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();

    res.status(200).json({ 
      success: true, 
      deletedCount: publicIds.length,
      results 
    });
  } catch (error) {
    console.error('Admin delete all error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}