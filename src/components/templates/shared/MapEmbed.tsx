import React from 'react';

interface MapEmbedProps {
  url: string;
}

export const MapEmbed: React.FC<MapEmbedProps> = ({ url }) => {
  return (
    <div className="w-full h-64">
      <iframe
        src={url}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        title="Location Map"
      />
    </div>
  );
};
