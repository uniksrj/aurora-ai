export async function deleteFromCloudinary(publicId) {
  try {
    const response = await fetch('/api/delete-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ publicId }),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to delete image');
    }

    return result;
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
}