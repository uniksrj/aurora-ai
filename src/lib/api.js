
export async function generateImages({ prompt, style = "default", count = 4, size = 1024 }) {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ prompt, style, count, size }),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(`Generate failed (${res.status}): ${text || res.statusText}`)
  }
  const json = await res.json()
  return json?.images || []
}


// src/lib/api.js
export async function generateImagesAi({ prompt, style = "default", count = 1, size = 1024 }) {
  const apiKey = import.meta.env.VITE_STABILITY_API_KEY; // ⚠️ keep key in .env file
  const url = "https://api.stability.ai/v1/generation/stable-diffusion-v1-6/text-to-image";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      text_prompts: [{ text: prompt }],
      cfg_scale: 7,
      samples: count,
      height: size,
      width: size,
      style_preset: style === "default" ? undefined : style
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`API Error: ${errText}`);
  }

  const data = await response.json();

  return data.artifacts.map((art, idx) => ({
    id: `${Date.now()}-${idx}`,
    prompt,
    style,
    width: size,
    height: size,
    cdnUrl: `data:image/png;base64,${art.base64}`
  }));
}


export async function editImageWithAI({
  imageFile = null,
  prompt = "",
  strength = 0.7,
  aspect_ratio = "1:1",
  output_format = "png",
  negative_prompt = "",
  style_preset = "",
  count = 1,
  userId = null,
}) {

  const apiKey = import.meta.env.VITE_STABILITY_API_KEY;
  const apiUrl = "https://api.stability.ai/v2beta/stable-image/generate/core";

  const formData = new FormData();

  if (prompt) formData.append("prompt", prompt);
  if (aspect_ratio) formData.append("aspect_ratio", aspect_ratio);
  if (output_format) formData.append("output_format", output_format);
  if (negative_prompt) formData.append("negative_prompt", negative_prompt);
  if (style_preset) formData.append("style_preset", style_preset);
  if (count) formData.append("count", count);

  if (imageFile) {
    formData.append("image", imageFile);
    formData.append("strength", strength);
  }

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Accept": "application/json",
    },
    body: formData,
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`API Error: ${errText}`);
  }

  const data = await response.json();
  let images = [];

  if (Array.isArray(data.images)) {
    // Loop through all images returned
    for (const img of data.images) {
      const imageUrl = await uploadToCloudinary(img.base64);
      images.push({
        imageUrl,
        prompt,
        stylePreset: style_preset,
        aspectRatio: aspect_ratio,
      });
    }
  } else if (data.image) {
    // Single image returned
    const imageUrl = await uploadToCloudinary(data.image);
    images.push({
      imageUrl,
      prompt,
      stylePreset: style_preset,
      aspectRatio: aspect_ratio,
    });
  } else if (data.image_url) {
    images.push({
      imageUrl: data.image_url,
      prompt,
      stylePreset: style_preset,
      aspectRatio: aspect_ratio,
    });
  }

  return images;
}

function base64ToBlob(base64) {
  const byteString = atob(base64.split(",")[1]);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const intArray = new Uint8Array(arrayBuffer);
  for (let i = 0; i < byteString.length; i++) {
    intArray[i] = byteString.charCodeAt(i);
  }
  return new Blob([intArray], { type: "image/png" });
}

async function uploadToCloudinary(base64) {
  const formData = new FormData();
  formData.append("file", `data:image/png;base64,${base64}`);
  formData.append("upload_preset", "demoUpload");

  const res = await fetch("https://api.cloudinary.com/v1_1/deuwelzrs/image/upload", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  // Store image metadata in Firestore (central collection)
  await storeImageMetadata({
    publicId: data.public_id,
    url: data.secure_url,
    userId: user.uid,
    userEmail: user.email,
    prompt: "user's prompt here", // pass this from your UI
    createdAt: new Date().toISOString()
  });

  return {
    secure_url: data.secure_url,
    public_id: data.public_id
  };
}

// Store image metadata in central collection
async function storeImageMetadata(imageData) {
  const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
  const { db } = await import('../firebase/config');

  try {
    await addDoc(collection(db, 'images'), {
      ...imageData,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error storing image metadata:', error);
  }
}

export async function getAllImages(user) {
  const token = await user.getIdToken();

  const response = await fetch('/api/admin/images', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch images');
  }

  return await response.json();
}

// Delete multiple images (admin only)
export async function adminDeleteImages(publicIds, user) {
  const token = await user.getIdToken();

  const response = await fetch('/api/admin/delete-all', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ publicIds })
  });

  if (!response.ok) {
    throw new Error('Failed to delete images');
  }

  return await response.json();
}


// const firebaseAdminConfig = {
//   credential: cert({
//     projectId: process.env.FIREBASE_PROJECT_ID,
//     clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
//     privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
//   }),
// };

// export function initAdmin() {
//   if (getApps().length === 0) {
//     initializeApp(firebaseAdminConfig);
//   }
// }