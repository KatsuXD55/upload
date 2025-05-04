
import { useState } from "react";

export default function Home() {
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!image) return;
    setLoading(true);
    const base64 = await toBase64(image);
    const res = await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageBase64: base64 }),
    });
    const data = await res.json();
    setUrl(data.url);
    setLoading(false);
  };

  const toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Image to URL Uploader</h1>
      <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
      <button onClick={handleUpload} disabled={loading} className="bg-green-600 text-white px-4 py-2 mt-4 rounded">
        {loading ? "Uploading..." : "Upload Image"}
      </button>
      {url && (
        <div className="mt-4">
          <p>Image URL:</p>
          <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{url}</a>
        </div>
      )}
    </div>
  );
}
