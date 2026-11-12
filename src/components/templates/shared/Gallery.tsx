import React from 'react';
import Image from 'next/image';

interface GalleryProps {
  images: string[];
}

export const Gallery: React.FC<GalleryProps> = ({ images }) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      {images.map((src, index) => (
        <div key={index} className="relative w-full h-48">
          <Image
            src={src}
            alt={`Gallery ${index}`}
            fill
            className="object-cover rounded"
          />
        </div>
      ))}
    </div>
  );
};
