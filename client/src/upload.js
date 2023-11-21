import React, { useState } from "react";
import axios from "axios";

const ImageUpload = () => {
  const [image, setImage] = useState(null);
  const API_ENDPOINT =
    process.env.REACT_APP_API_ENDPOINT || "http://localhost:8000/";

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
          <input
            type="file"
            id="imageInput"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        <button type="submit">Post MyFav Pic</button>
      </form>
    </div>
  );
};

export default ImageUpload;
