export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { admin } = await import('firebase-admin');
    
    // Verify admin role using Firebase Admin SDK
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    const userDoc = await admin.firestore().collection('users').doc(decodedToken.uid).get();
    
    if (!userDoc.exists || userDoc.data().role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    // Get all images
    const snapshot = await admin.firestore()
      .collection('images')
      .orderBy('createdAt', 'desc')
      .get();

    const images = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json({ images });
  } catch (error) {
    console.error('Admin images error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}