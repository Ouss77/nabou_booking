"use client";

import { useStoreForm } from "./store-form-context";
import { useState } from "react";

export default function ImagesTab() {
  const { addImages } = useStoreForm();
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    addImages(files); // ✅ use the context function

    // For preview:
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(previews);
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-zinc-300">
        Upload Images
      </label>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        className="block w-full text-sm text-zinc-300 file:bg-zinc-800 file:border file:border-zinc-600 file:px-4 file:py-2 file:rounded file:text-zinc-200 hover:file:bg-zinc-700"
      />
      <div className="grid grid-cols-3 gap-4 mt-4">
        {previewUrls.map((url, idx) => (
          <img
            key={idx}
            src={url}
            alt={`Preview ${idx}`}
            className="h-32 object-cover rounded-md border border-zinc-700"
          />
        ))}
      </div>
    </div>
  );
}
