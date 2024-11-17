import { useState } from 'react';
import { toast } from 'react-toastify';

export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);

  const uploadImage = async (file: File) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "Blogs-app");
    data.append("cloud_name", "dv4he6oc9");

    try {
      setUploading(true);
      const res = await fetch("https://api.cloudinary.com/v1_1/dv4he6oc9/image/upload", {
        method: "POST",
        body: data,
      });
      const uploadImg = await res.json();
      setUploading(false);
      return uploadImg.secure_url;
    } catch (error) {
      setUploading(false);
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
      return null;
    }
  };

  return { uploadImage, uploading };
};