import React from "react";
import Button from "../../atoms/Button";

const GuideImagesSection = ({ images = [] }) => (
  <div>
    <h2 className="text-xl font-semibold mb-4">Image Gallery</h2>
    <div className="flex gap-4 mb-4">
      {images.map((img, idx) => (
        <img key={idx} src={img} alt={`Guide gallery ${idx + 1}`} className="w-56 h-40 object-cover rounded-lg" />
      ))}
    </div>
    <div className="mt-2">
      <Button variant="secondary" className="px-5 py-2 text-sm font-semibold">Show All</Button>
    </div>
  </div>
);

export default GuideImagesSection; 