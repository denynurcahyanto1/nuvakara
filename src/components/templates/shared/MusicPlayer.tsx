import React from 'react';

interface MusicPlayerProps {
  url: string;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ url }) => {
  return (
    <div className="p-4 border rounded">
      <p>Music: {url}</p>
      <audio controls src={url} />
    </div>
  );
};
