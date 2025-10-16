export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    if (!file) return reject("No file provided");

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      // remove the "data:image/png;base64," part
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };

    reader.onerror = (error) => reject(error);
  });
}