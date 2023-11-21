import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ImageUpload = () => {
  const [image, setImage] = useState(null);
  const API_ENDPOINT =
    process.env.REACT_APP_API_ENDPOINT || "http://localhost:8000/";
  const MAX_FILE_SIZE = 1024 * 1024; // 1MB

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    if (!selectedImage) {
      console.error("No file selected");
      return;
    }
    setImage(selectedImage);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      console.error("No file selected");
      return;
    }

    if (image.size > MAX_FILE_SIZE) {
      console.error("File size exceeds the limit");
      return;
    }

    const formData = new FormData();
    const code = localStorage.getItem("linkedInAuthToken");
    formData.append("image", image);
    formData.append("code", code);

    try {
      const response = await axios.post(`${API_ENDPOINT}upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Image uploaded successfully");
      console.log("Response from server:", response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <h2>Image Upload</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="imageInput">Select an image:</label>
          <input type="file" id="imageInput" onChange={handleImageChange} />
        </div>
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default ImageUpload;
