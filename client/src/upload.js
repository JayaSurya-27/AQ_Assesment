import React, { useState } from "react";
import axios from "axios";

const LinkedInImageUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const linkedInAccessToken = localStorage.getItem("linkedInAccessToken");

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleImageUpload = async () => {
    try {
      // Step 1: Register image upload
      const registerUploadResponse = await axios.post(
        "https://api.linkedin.com/v2/assets?action=registerUpload",
        {
          registerUploadRequest: {
            recipes: ["urn:li:digitalmediaRecipe:feedshare-image"],
            owner: "urn:li:person:8675309",
            serviceRelationships: [
              {
                relationshipType: "OWNER",
                identifier: "urn:li:userGeneratedContent",
              },
            ],
          },
        },
        {
          headers: {
            Authorization: `Bearer ${linkedInAccessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Get upload URL and asset details from the response
      const { uploadUrl } =
        registerUploadResponse.data.value.uploadMechanism.com.linkedin
          .digitalmedia.uploading.MediaUploadHttpRequest;

      // Step 2: Upload image file to LinkedIn
      const formData = new FormData();
      formData.append("file", selectedFile);

      await axios.post(uploadUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Step 3: Create the image share
      const createImageShareResponse = await axios.post(
        "https://api.linkedin.com/v2/ugcPosts",
        {
          author: "urn:li:person:8675309",
          lifecycleState: "PUBLISHED",
          specificContent: {
            "com.linkedin.ugc.ShareContent": {
              shareCommentary: {
                text: "Feeling inspired after meeting so many talented individuals at this year's conference. #talentconnect",
              },
              shareMediaCategory: "IMAGE",
              media: [
                {
                  status: "READY",
                  description: { text: "Center stage!" },
                  media: registerUploadResponse.data.value.mediaArtifact,
                  title: { text: "LinkedIn Talent Connect 2021" },
                },
              ],
            },
          },
          visibility: {
            "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
          },
        },
        {
          headers: {
            Authorization: `Bearer ${linkedInAccessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Image share created:", createImageShareResponse);
    } catch (error) {
      console.error("Error uploading image to LinkedIn:", error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleImageUpload}>Upload Image to LinkedIn</button>
    </div>
  );
};

export default LinkedInImageUploader;
