import { useState } from 'react';
import { deleteFromCloudinary } from '../lib/deleteImage';

export function DeleteImage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleGenerateImage = async (prompt) => {
    setLoading(true);
    try {
      const base64Image = await yourAIGenerationFunction(prompt);
      const uploadResult = await uploadToCloudinary(base64Image);
      
      setImages(prev => [...prev, {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        prompt
      }]);
    } catch (error) {
      alert('Error generating image: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async (publicId) => {
    if (!confirm('Are you sure you want to delete this image?')) return;
    
    try {
      await deleteFromCloudinary(publicId);
      setImages(prev => prev.filter(img => img.publicId !== publicId));
      alert('Image deleted successfully!');
    } catch (error) {
      alert('Error deleting image: ' + error.message);
    }
  };

  return (
    <div>
      {/* Your generation UI */}
      
      <div className="image-grid">
        {images.map((image) => (
          <div key={image.publicId} className="image-card">
            <img src={image.url} alt={image.prompt} />
            <button 
              onClick={() => handleDeleteImage(image.publicId)}
              disabled={loading}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}