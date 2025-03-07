import React, { useState } from "react";

export default function ProfileUpload() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const uploadProfilePicture = async () => {
    if (!image) return alert("Please select an image!");

    setLoading(true);
    const formData = new FormData();
    formData.append("profileImage", image);

    try {
      const response = await fetch("http://localhost:5000/user/upload-profile", {
        method: "POST",
        body: formData,
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      const data = await response.json();
      if (data.success) {
        alert("Profile picture uploaded successfully!");
        window.location.reload(); // Refresh to show new profile picture
      } else {
        alert("Upload failed!");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error uploading image!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Upload Profile Picture</h2>
      {preview && <img src={preview} alt="Profile Preview" className="preview-image" />}
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={uploadProfilePicture} disabled={loading}>
        {loading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}
